export type Project = {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  client_side: "required" | "optional" | "unsupported" | "unknown";
  server_side: "required" | "optional" | "unsupported" | "unknown";
  project_type: "mod" | "modpack" | "resourcepack" | "shader";
  downloads: number;
  icon_url: string | null;
  color: number | null;
  thread_id: string;
  monetization_status?: "monetized" | "demonetized" | "force-demonetized";
  project_id: string;
  author: string;
  display_categories: string[];
  versions: string[];
  follows: number;
  date_created: string;
  date_modified: string;
  latest_version?: string;
  license: string;
  gallery: string[];
  featured_gallery: string | null;
  id: string;
};

export interface ProjectSearchResults {
  hits: Project[];
  offset: number;
  limit: number;
  total_hits: number;
}

export type Category = {
  icon: string;
  name: string;
  project_type: string;
  header: string;
};
