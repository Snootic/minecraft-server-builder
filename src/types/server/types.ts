export type serverPropertiesProps = Record<string, string | number | boolean>;
export type LegacyDifficulty = 0 | 1 | 2 | 3;
export type ModernDifficulty = "peaceful" | "easy" | "normal" | "hard";
export type LegacyGamemode = 0 | 1 | 2 | 3;
export type ModernGamemode =
  | "survival"
  | "creative"
  | "adventure"
  | "spectator";
export type LevelType =
  | "minecraft:normal"
  | "minecraft:flat"
  | "minecraft:large_biomes"
  | "minecraft:amplified";

export type ServerProperties = serverPropertiesProps & {
  difficulty?: LegacyDifficulty | ModernDifficulty;
  gamemode?: LegacyGamemode | ModernGamemode;
  "level-type"?: LevelType;
};

export interface VersionDiff {
  version: string;
  additions: serverPropertiesProps;
  removals?: string[];
  notes?: string;
}
