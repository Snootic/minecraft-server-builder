import axios from 'axios';
import { useSuspenseQueries, useSuspenseQuery, type UseSuspenseQueryResult } from '@tanstack/react-query';
import type { Category, Loader, Project, ProjectSearchResults, ProjectVersion, Version } from '../types';
import { MODRINTH_API } from '../constants/API';

const apiClient = axios.create({
    baseURL: MODRINTH_API,
    headers: {
        'User-Agent': 'Minecraft-Server-Builder/1.0.0 (snootic@coisas-mais-estranhas.com.br)'
    }
});

const toQueryArray = (value?: string | string[]) =>
    value ? JSON.stringify(Array.isArray(value) ? value : [value]) : undefined;

type ProjectVersionFilters = {
    game_versions?: string | string[];
    loaders?: string | string[];
    featured?: boolean;
};

const getProjectVersionsQueryOptions = (projectId: string, filters?: ProjectVersionFilters) => ({
    queryKey: ['project-versions', projectId, filters],
    queryFn: async () => {
        const params = new URLSearchParams();

        const gameVersions = toQueryArray(filters?.game_versions);
        if (gameVersions) params.set('game_versions', gameVersions);

        const loaders = toQueryArray(filters?.loaders);
        if (loaders) params.set('loaders', loaders);

        if (typeof filters?.featured === 'boolean') params.set('featured', String(filters.featured));

        const res: { data: ProjectVersion[] } = await apiClient.get(
            `/project/${projectId}/version${params.toString() ? `?${params.toString()}` : ''}`
        );
        return res.data;
    },
    staleTime: 1000 * 60 * 60
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

export const useProjectVersions = (
    projectId: string,
    filters?: ProjectVersionFilters
) => useSuspenseQuery(getProjectVersionsQueryOptions(projectId, filters));

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

// is this really necessary? Investigate further later.
export const useGeyser = (version: string, loader: string) => {
    const projectIds = ["wKkoqHrH", "bWrNNfkb"] as const;
    const versionQueries = useSuspenseQueries({
        queries: projectIds.map((projectId) =>
            getProjectVersionsQueryOptions(projectId, {
                game_versions: version,
                loaders: loader
            })
        )
    });

    return {
        data: versionQueries
            .map((query) => query.data[0])
            .filter((version): version is ProjectVersion => Boolean(version))
    };
};
