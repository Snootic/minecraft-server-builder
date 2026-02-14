export type BuildsVersions = {
  success: boolean;
  builds: Array<{
    id: number;
    versionId: string | null;
    projectVersionId: string | null;
    type:
      | "VANILLA"
      | "PAPER"
      | "PUFFERFISH"
      | "SPIGOT"
      | "FOLIA"
      | "PURPUR"
      | "WATERFALL"
      | "VELOCITY"
      | "FABRIC"
      | "BUNGEECORD"
      | "QUILT"
      | "FORGE"
      | "NEOFORGE"
      | "MOHIST"
      | "ARCLIGHT"
      | "SPONGE"
      | "LEAVES"
      | "CANVAS"
      | "ASPAPER"
      | "LEGACY_FABRIC"
      | "LOOHP_LIMBO"
      | "NANOLIMBO"
      | "DIVINEMC"
      | "MAGMA"
      | "LEAF"
      | "VELOCITY_CTD"
      | "YOUER"
      | "PLUTO";
    experimental: boolean;
    name: string;
    buildNumber: number;
    jarUrl: string | null;
    jarSize: number | null;
    zipUrl: string | null;
    zipSize: number | null;
    installation: Array<
      Array<
        | {
            url: string;
            file: string;
            size: number;
            type: "download";
          }
        | {
            file: string;
            location: string;
            type: "unzip";
          }
        | {
            location: string;
            type: "remove";
          }
      >
    >;
    changes: string[];
    created: string | null;
  }>;
};
