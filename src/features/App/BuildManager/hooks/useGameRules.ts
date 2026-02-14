import { GameRuleHistoryParser, getWikiUrl } from "@/api/wikiParse";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type WikiParseResponse = {
    parse: {
        text: {
            "*": string;
        };
    };
};

export const useGameRules = (targetVersion: string) => {
    const { t, i18n } = useTranslation();

    const WIKI_URL = useMemo(() => {
        return getWikiUrl(i18n.language);
    }, [i18n]);

    return useSuspenseQuery({
        queryKey: ["gamerules", targetVersion, WIKI_URL, t("wiki.Game_rule")],
        queryFn: async () => {
            const apiUrl = WIKI_URL;
            const page = t("wiki.Game_rule");
            const res = await axios.get<WikiParseResponse>(apiUrl, {
                params: {
                    action: "parse",
                    page,
                    format: "json",
                    prop: "text",
                    origin: "*",
                },
            });
            const html = res.data.parse.text["*"];
            const parser = new GameRuleHistoryParser(html, t);
            const rules = parser.getRulesForVersion(targetVersion);
            return rules;
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
};