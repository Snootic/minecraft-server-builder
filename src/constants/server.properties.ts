import type { LegacyDifficulty, LegacyGamemode, ModernDifficulty, ModernGamemode, VersionDiff } from "../types";

export const ServerPropertiesSchema = {
    // this is a base Server Properties file that uses the
    // first currently possible to get (from wiki at least)
    // configurations (version 1.2)
    genericBase: {
        "allow-flight": false,
        "allow-nether": true,
        "difficulty": 1 as LegacyDifficulty,
        "enable-query": false,
        "enable-rcon": false,
        "gamemode": 0 as LegacyGamemode,
        "generate-structures": true,
        "level-name": "world",
        "level-seed": "",
        "level-type": "DEFAULT",
        "max-players": 20,
        "motd": "A Minecraft Server",
        "online-mode": true,
        "op-permission-level": 4,
        "pvp": true,
        "resource-pack": "",
        "server-ip": "",
        "server-port": 25565,
        "spawn-animals": true,
        "spawn-monsters": true,
        "spawn-npcs": true,
        "view-distance": 10,
        "white-list": false
    },

    //diffs per version
    //will override the generic base
    versionHistory: [
        {
            version: "1.2.1",
            additions: { "max-build-height": 256 }
        },
        {
            version: "1.3.1",
            additions: { "snooper-enabled": true }
        },
        {
            version: "1.4.2",
            additions: { "spawn-protection": 16, "enable-command-block": false }
        },
        {
            version: "1.8",
            additions: { 
                "generator-settings": "", 
                "network-compression-threshold": 256,
                "max-tick-time": 60000 
            }
        },
        {
            version: "1.11",
            additions: { "prevent-proxy-connections": false }
        },
        {
            version: "1.12",
            additions: { "enforce-whitelist": false },
            removals: ["announce-player-achievements"]
        },
        {
            version: "1.14",
            additions: { 
                "difficulty": "easy" as ModernDifficulty,
                "gamemode": "survival" as ModernGamemode,
                "function-permission-level": 2,
                "broadcast-rcon-to-ops": true,
                "broadcast-console-to-ops": true 
            },
            notes: "Difficulty and Gamemode switched from integers to strings."
        },
        {
            version: "1.15",
            additions: { "enable-status": true, "sync-chunk-writes": true }
        },
        {
            version: "1.16",
            additions: { 
                "entity-broadcast-range-percentage": 100,
                "enable-jmx-monitoring": false,
                "text-filtering-config": ""
            }
        },
        {
            version: "1.17",
            additions: { "require-resource-pack": false, "resource-pack-prompt": "" },
            removals: ["max-build-height"]
        },
        {
            version: "1.18",
            additions: { "simulation-distance": 10, "hide-online-players": false },
            removals: ["snooper-enabled"]
        },
        {
            version: "1.19",
            additions: { 
                "enforce-secure-profile": true, 
                "max-chained-neighbor-updates": 1000000 
            }
        },
        {
            version: "1.20",
            additions: { "log-ips": true, "resource-pack-id": "" },
            notes: "File encoding switched to UTF-8 natively."
        },
        {
            version: "1.21.2",
            additions: { "pause-when-empty-seconds": 60 },
            removals: ["spawn-animals", "spawn-npcs"]
        },
        {
            version: "1.21.9",
            additions: { 
                "management-server-enabled": false,
                "management-server-host": "localhost",
                "management-server-port": 0,
                "management-server-secret": "",
                "enable-code-of-conduct": false,
                "bug-report-link": ""
            },
            removals: ["allow-nether", "enable-command-block", "pvp", "spawn-monsters"],
            notes: "Major management overhaul and cleanup of legacy toggles."
        }
    ] as VersionDiff[]
};