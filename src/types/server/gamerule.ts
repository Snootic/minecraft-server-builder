export interface GameRuleMetadata {
  name: string;
  description: string;
  defaultValue: string;
  type: string;
}

export interface GameruleEntry {
  name: string;
  value: string;
}

export interface VersionEvent {
  version: string;
  action: "add" | "remove" | "rename";
  ruleName: string;
  oldName?: string;
}
