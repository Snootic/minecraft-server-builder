import { MCJARS } from "../constants/API";
import type { BuildsVersions } from "../types";
import axios from "axios";

const apiClient = axios.create({
    baseURL: MCJARS,
    headers: {
        'User-Agent': 'Minecraft-Server-Builder/1.0.0 (snootic@coisas-mais-estranhas.com.br)'
    }
});


export interface ServerJarInfo {
    jarUrl: string;
    buildId: number;
    jarSize: number | null;
}

//only request we'll need is to get the build
//I think the latest for each version is fine, so mcjars will do the job
export const fetchServerJar = async (loaderName: string, version: string): Promise<ServerJarInfo> => {
    const res: { data: BuildsVersions } = await apiClient.get(
        `/builds/${loaderName.toLocaleUpperCase()}/${version}`
    );

    const build = res.data.builds[0];
    if (!build?.jarUrl) {
        throw new Error("No server jar available for this version/loader combination.");
    }

    return {
        jarUrl: build.jarUrl,
        buildId: build.id,
        jarSize: build.jarSize,
    };
};