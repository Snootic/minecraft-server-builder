import { MCMeta } from "@/constants/mcMeta";
import type { GameruleEntry } from "@/types";
import JSZip from "jszip";

function createMCMeta(gameruleDatapackZip: JSZip) {
    gameruleDatapackZip.file("pack.mcmeta", JSON.stringify(MCMeta));
}

export function createGameruleDatapack(gamerules: GameruleEntry[]): JSZip {
    const zip = new JSZip();
    
    createMCMeta(zip);

    const functionContent = gamerules
        .map(rule => `gamerule ${rule.name} ${rule.value}`)
        .join("\n");
    
    const tagContent = JSON.stringify({ values: ["gamerule_pack:load"] }, null, 2);
    zip.file("data/gamerule_pack/function/load.mcfunction", functionContent);
    zip.file("data/minecraft/tags/functions/load.json", tagContent);
    
    zip.file("modern_format/data/gamerule_pack/functions/load.mcfunction", functionContent);
    zip.file("modern_format/data/minecraft/tags/function/load.json", tagContent);

    return zip;
}