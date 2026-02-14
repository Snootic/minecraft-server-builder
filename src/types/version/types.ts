export type Version = {
  version: string;
  version_type: string;
  date: string;
};

export type DependencyType =
  | "required"
  | "optional"
  | "incompatible"
  | "embedded";

export type VersionType = "release" | "beta" | "alpha";

export type VersionStatus =
  | "listed"
  | "archived"
  | "draft"
  | "unlisted"
  | "scheduled"
  | "unknown";

export type RequestedStatus =
  | "listed"
  | "archived"
  | "draft"
  | "unlisted"
  | null;

export type FileType =
  | "required-resource-pack"
  | "optional-resource-pack"
  | "sources-jar"
  | "dev-jar"
  | "javadoc-jar"
  | "unknown"
  | "signature"
  | null;
