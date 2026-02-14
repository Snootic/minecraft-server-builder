import type { DependencyType, VersionType, VersionStatus, RequestedStatus, FileType } from '../version/types';

export interface VersionDependency {
  version_id: string | null;
  project_id: string | null;
  file_name: string | null;
  dependency_type: DependencyType;
}

export interface VersionFile {
  hashes: Record<string, string>;
  url: string;
  filename: string;
  primary: boolean;
  size: number;
  file_type: FileType;
}

export interface ProjectVersion {
  name: string;
  version_number: string;
  changelog: string | null;
  dependencies: VersionDependency[];
  game_versions: string[];
  version_type: VersionType;
  loaders: string[];
  featured: boolean;
  status: VersionStatus;
  requested_status: RequestedStatus;
  id: string;
  project_id: string;
  author_id: string;
  date_published: string;
  downloads: number;
  changelog_url: string | null;
  files: VersionFile[];
}
