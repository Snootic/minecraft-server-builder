import * as cheerio from 'cheerio';
import type { GameRuleMetadata, VersionEvent } from '../types';
import { compareVersions } from '../tools/versionHelpers';
import type { TFunction } from 'i18next';

//unfortunately the wiki has no complete history of gamerules for ES and PT
//So we are fallbacking to English for these languages
//If someone wants to contribute with the history for these languages, it would be great
export const getWikiUrl = (lang: string) => {
    const prefix = ['en', 'es', 'pt'].includes(lang) ? '' : `${lang}.`;
    return `https://${prefix}minecraft.wiki/api.php`;
};

// TODO - do the same as GameRuleHistoryParser for ServerProperties
export class GameRuleHistoryParser {
    private chr: cheerio.CheerioAPI;
    private ruleMetadata: Map<string, GameRuleMetadata> = new Map();
    private historyEvents: VersionEvent[] = [];
    private t: TFunction<"translation", undefined>

    constructor(html: string, t: TFunction<"translation", undefined>) {
        this.chr = cheerio.load(html);
        this.t = t;
        this.parseCurrentRules();
        this.parseHistory();
    }

    private parseCurrentRules() {
        const chr = this.chr;

        if (['en', 'es', 'pt'].includes((this.t as unknown as { lng?: string }).lng ?? '')) { // workaround to say to ts that .lng exists on t (it really does)
            // the english version of the wiki is built different from the others, so we need to parse it differently
            chr('.wikitable.sortable').find('tr').each((_, row) => {
                const cols = chr(row).find('td');
                if (cols.length < 5) return;

                let name = chr(cols[0]).text().trim();

                if (name.includes('BE:')) name = name.split('BE:')[0].trim();
                if (name.includes('JE:')) name = name.match(/JE:\s*([^\s]+)/)?.[1] || name;

                const description = chr(cols[1]).text().trim();
                const defaultValue = chr(cols[2]).text().replace(/\[.*?\]/g, '').trim();
                const type = chr(cols[3]).text().trim();

                this.ruleMetadata.set(name, { name, description, defaultValue, type });
            });
        } else {
            const javaTable = chr('.wikitable').first();
            javaTable.find('tr').each((_, row) => {
                const cols = chr(row).find('td');
                if (cols.length < 5) return;

                let name = chr(cols[0]).find('code').text().trim();
                if (!name) {
                    name = chr(cols[0]).text().trim();
                }

                const headerRow = javaTable.find('tr').first();
                let descriptionColIndex = -1;
                let defaultValueColIndex = -1;
                let typeColIndex = -1;
                headerRow.find('th').each((i, th) => {
                    if (chr(th).text().trim() === this.t('wiki.description')) {
                        descriptionColIndex = i;
                    } else if (chr(th).text().trim() === this.t('wiki.defaultValue')) {
                        defaultValueColIndex = i;
                    } else if (chr(th).text().trim() === this.t('wiki.type')) {
                        typeColIndex = i;
                    }
                });
                const description = descriptionColIndex !== -1 ? chr(cols[descriptionColIndex]).text().trim() : '';
                const defaultValue = defaultValueColIndex !== -1 ? chr(cols[defaultValueColIndex]).text().replace(/\[.*?\]/g, '').trim() : '';
                const type = typeColIndex !== -1 ? chr(cols[typeColIndex]).text().trim() : '';

                this.ruleMetadata.set(name, { name, description, defaultValue, type });
            });
        }
    }

    private parseHistory() {
        //TODO - find a way to detect japanese renames, the wiki doesn't provide
        //a reliable way to detect them, only way I can find out is to direct compare the text
        //so because of this, 1.21.11 on japanese may have a bunch of broken game rules
        const chr = this.chr;
        const historyTable = chr('table[data-description="History"], table[data-description="歴史"]');
        
        let currentMajorVersion = this.t('wiki.unknown');
        
        const trs = historyTable.find('tr')
        let collapsibleRowsIterated = 0;
        for (let i = 0; i < trs.length; i++) {
            const row = trs[i];
            const th = chr(row).find('th');
            if (th.length > 0 && th.attr('colspan') === '8') {
                if (collapsibleRowsIterated >= 1) {
                    break;
                }

                const text = chr(row).text().trim();
                collapsibleRowsIterated++;
                if (text !== this.t('wiki.javaEdition')) {
                    return;
                }
                continue
            }

            let versionLink = chr(row).find('th.nowrap').find('a').first();
            if (versionLink.length === 0 && i > 0) {
                for (let j = i - 1; j >= 0; j--) {
                    versionLink = chr(trs[j]).find('th.nowrap').find('a').first();
                    if (versionLink.length > 0) break;
                }
            }
            if (versionLink.length === 0) continue
            
            currentMajorVersion = versionLink.text();
            const text = chr(row).find('td').text();

            const extractRuleNames = (): string[] => {
                const names: string[] = [];
                if ((this.t as unknown as { lng?: string }).lng === 'zh') {
                    const matches = text.match(/[a-zA-Z][a-zA-Z0-9_]*/g);
                    if (matches) {
                        names.push(...matches.filter(n => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(n)));
                    }
                } else {
                    chr(row).find('code').each((_, el) => {
                        const elText = chr(el).text().trim();
                        if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(elText)) {
                            names.push(elText);
                        }
                    });
                }
                return names;
            };

            if (text.includes(this.t('wiki.addedFollowingGamerules')) || text.includes(this.t('wiki.addedFollowingGameRules')) || text.includes(this.t('wiki.addedGameRule'))) {
                for (const ruleName of extractRuleNames()) {
                    this.historyEvents.push({ version: currentMajorVersion, action: 'add', ruleName });
                }
            }

            if (text.includes(this.t('wiki.renamedGameRule'))) {
                const names = extractRuleNames();
                for (let j = 0; j + 1 < names.length; j += 2) {
                    this.historyEvents.push({
                        version: currentMajorVersion,
                        action: 'rename',
                        oldName: names[j],
                        ruleName: names[j + 1]
                    });
                }
            }

            //chinese wiki also uses 以取代 for removed gamerule idk why because translator says
            //this word is "replaced by"
            if (text.includes(this.t('wiki.removedGameRule')) || text.includes('以取代')) {
                for (const ruleName of extractRuleNames()) {
                    this.historyEvents.push({ version: currentMajorVersion, action: 'remove', ruleName });
                }
            }
        }
    }


    public getRulesForVersion(targetVersion: string): GameRuleMetadata[] {
        const activeRules = new Set<string>();

        for (const event of this.historyEvents) {
            const comparison = compareVersions(event.version.split('.').map(Number), targetVersion.split('.').map(Number));
            if (comparison > 0) continue;
            if (event.action === 'add') {
                activeRules.add(event.ruleName);
            } else if (event.action === 'remove') {
                activeRules.delete(event.ruleName);
            } else if (event.action === 'rename' && event.oldName) {
                activeRules.delete(event.oldName);
                activeRules.add(event.ruleName);
            }
        }

        return Array.from(activeRules).map(name => {
            let meta = this.ruleMetadata.get(name);
            
            if (!meta) {
                // the wiki is not 100% reliable on gamerule changes
                // it does not map some of the new changes to snake case on 1.21.11
                // so we need to do some fuzzy matching to try to find the correct metadata for the gamerule
                
                //We'll basically check if there are recent renames to snake case format.
                //If there are, we'll assume that the snake case version is the correct one
                //otherwise we'll convert to camel case
                const recentRenames = this.historyEvents.filter(e => e.action === 'rename');
                const renamesWithUnderscores = recentRenames.filter(e => e.ruleName.includes('_') || (e.oldName && e.oldName.includes('_')));
                const relevantRenames = renamesWithUnderscores.filter(e => {
                    const comparison = compareVersions(e.version.split('.').map(Number), targetVersion.split('.').map(Number));
                    return comparison < 0;
                });
                const useSnakeCase = relevantRenames.length > 0;

                for (const [metaName, metadata] of this.ruleMetadata.entries()) {
                    if (useSnakeCase) {
                        const toSnake = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                        const normalizedName = toSnake(name);
                        const normalizedMetaName = toSnake(metaName);
                        if (normalizedName === normalizedMetaName || normalizedName.includes(normalizedMetaName) || normalizedMetaName.includes(normalizedName)) {
                            meta = metadata;
                            break;
                        }
                    } else {
                        const toCamel = (s: string) => s.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase()).replace(/_/g, '');
                        const normalizedName = toCamel(name);
                        const normalizedMetaName = toCamel(metaName);
                        if (normalizedName === normalizedMetaName || normalizedName.includes(normalizedMetaName) || normalizedMetaName.includes(normalizedName)) {
                            meta = metadata;
                            meta.name = normalizedName;
                            break;
                        }
                    }
                }
            }
            return meta || { 
                name, 
                description: this.t('wiki.noDescription'), 
                defaultValue: this.t('wiki.unknown'), 
                type: this.t('wiki.unknown')
            };
        });
    }
    
    public getAllEvents() {
        return this.historyEvents;
    }
}