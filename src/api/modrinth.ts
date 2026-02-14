import axios from 'axios';
import { useSuspenseQuery, type UseSuspenseQueryResult } from '@tanstack/react-query';
import type { Category, Loader, Project, ProjectSearchResults, ProjectVersion, Version } from '../types';
import { MODRINTH_API } from '../constants/API';

const apiClient = axios.create({
    baseURL: MODRINTH_API,
    headers: {
        'User-Agent': 'Minecraft-Server-Builder/1.0.0 (snootic@coisas-mais-estranhas.com.br)'
    }
});

export const useSearch = (params: {
    categories?: string[],
    facets?: Record<string, string[]>,
    query?: string,
    offset?: number,
    loader?: string,
}) => useSuspenseQuery({
    queryKey: ['search', params],
    queryFn: async () => {
        const {categories, facets, loader, offset, query} = params

        const queryFacets: string[][] = [];
        const allowed = ["modpack", "datapack", "mod"]
        
        const finalCategories = []
        if (categories)
        for (const category of categories) {
            finalCategories.push(`categories:${category}`)
        }
        
        if (facets)
        for (const facet of Object.keys(facets)) {
            const facetQuery = []
            for (const value of facets[facet]) {
                if (facet === "project_type" && (!allowed.includes(value))) continue
                facetQuery.push(`${facet}:${value}`);
            }
            queryFacets.push(facetQuery)
        }
        
        if (finalCategories.length > 0) queryFacets.push(finalCategories)
        if (loader) queryFacets.push([`categories:${loader}`])
        
        queryFacets.push(["server_side!=unsupported"]);
    
        const queryOffset = offset ? Math.floor(offset / 2) : 0

        const encodedFacets = encodeURIComponent(JSON.stringify(queryFacets));
        const response = await apiClient.get(
            `${MODRINTH_API}/search?query=${query ?? ""}&limit=20&offset=${queryOffset * 20}&facets=${encodedFacets}`
        );

        return response.data as ProjectSearchResults;
    },
    staleTime: 1000 * 60 * 60
});

export const useProjects = (projectIds: string[]) => useSuspenseQuery({
    queryKey: ['projects', projectIds],
    queryFn: async () => {
        const ids = JSON.stringify(projectIds);
        const res: { data: Project[] } = await apiClient.get(`/projects?ids=${encodeURIComponent(ids)}`);
        return res.data;
    },
    staleTime: 1000 * 60 * 60
});

export const useProjectVersions = (projectId: string) => useSuspenseQuery({
    queryKey: ['project-versions', projectId],
    queryFn: async () => {
        const res: { data: ProjectVersion[] } = await apiClient.get(`/project/${projectId}/version`);
        return res.data;
    },
    staleTime: 1000 * 60 * 60
});

export const useCategories = () => useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: async () => {
        const res: { data: Category[] } = await apiClient.get('/tag/category');
        return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24
});

export const useGameVersions = (includeSnapshots = false, includeBeta = false, includeAlpha = false) => 
    useSuspenseQuery({
        queryKey: ['game-versions', includeSnapshots, includeBeta, includeAlpha],
        queryFn: async () => {
            const allVersions = await apiClient.get('/tag/game_version').then((res: {data: Version[]})=> res.data);
            return allVersions.filter((v: Version) => {
                if (v.version_type === "release") return true;
                if (includeSnapshots && v.version_type === "snapshot") return true;
                if (includeBeta && v.version_type === "beta") return true;
                if (includeAlpha && v.version_type === "alpha") return true;
                return false;
            }).map(v => v.version);
        },
        staleTime: 1000 * 60 * 60 * 24
    });

export const useLoaders = (): UseSuspenseQueryResult<Loader[], Error> => useSuspenseQuery({
    queryKey: ['loaders'],
    queryFn: async () => {
        const res: { data: Loader[] } = await apiClient.get('/tag/loader');
        const loaders = res.data.filter((l: Loader) => 
            Object.values(l.supported_project_types).includes("modpack") || 
            Object.values(l.supported_project_types).includes("datapack")
        );
        return loaders
    },
    staleTime: 1000 * 60 * 60 * 24
});

export const useGeyser = (version: string, loader: string): UseSuspenseQueryResult<ProjectVersion[] | null, Error> => useSuspenseQuery({
    queryKey: ['geyser', version, loader],
    queryFn: async () => {
        //wKkoqHrH - geyserId
        //bWrNNfkb - floodgateId
        const projectIds = ["wKkoqHrH", "bWrNNfkb"];
        const mods = [];
        for (const id of projectIds) {
            const versionsRes: { data: ProjectVersion[] } = await apiClient.get(`/project/${id}/version`);
            const compatibleVersion = versionsRes.data.find(v => 
                v.game_versions.includes(version) && v.loaders.includes(loader)
            );
            if (compatibleVersion) {
                mods.push(compatibleVersion);
            }
        }
        return mods;
    },
    staleTime: 1
});