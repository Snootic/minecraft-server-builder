import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useShallow } from "zustand/react/shallow";
import type { Project, ProjectVersion, VersionDependency } from "@/types";
import { useAppStore } from "@/stores/useStore";

const MODRINTH_API = "https://api.modrinth.com/v2";

export type projectData = {
    dependencies: Project[];
    mods: Project[];
    datapacks: Project[];
    mainProject: Project | undefined;
    isLoading: boolean;
}

export const useProjectData = (): projectData => {
    const { selectedInstance, selectedDatapacks, selectedMods } = useAppStore(
        useShallow((state) => ({
            selectedInstance: state.selectedInstance,
            selectedDatapacks: state.selectedDatapacks,
            selectedMods: state.selectedMods,
        }))
    );

    const projectIds = useMemo(() => {
        const dependenciesIds = selectedInstance ? selectedInstance.dependencies
            .map((d: VersionDependency) => d.project_id)
            .filter((id): id is string => id != null) : [];

        const datapacksProjects = selectedDatapacks.map((d: ProjectVersion) => d.project_id);
        const modsProjects = selectedMods.map((m: ProjectVersion) => m.project_id);

        const finalIds: string[] = [];
        finalIds.push(...dependenciesIds);
        finalIds.push(...datapacksProjects);
        finalIds.push(...modsProjects);

        if (selectedInstance) finalIds.push(selectedInstance.project_id);

        return finalIds;
    }, [selectedInstance, selectedDatapacks, selectedMods]);

    const { data: allProjects = [], isLoading } = useQuery({
        queryKey: ['projects', projectIds],
        queryFn: async () => {
            if (projectIds.length === 0) return [];
            const ids = JSON.stringify(projectIds);
            const res: {data: Project[]} = await axios.get(`${MODRINTH_API}/projects?ids=${encodeURIComponent(ids)}`);
            return res.data;
        },
        staleTime: 1000 * 60 * 60,
        enabled: projectIds.length > 0,
    });

    const projectData = useMemo(() => {
        const dependenciesIds = selectedInstance ? selectedInstance.dependencies
            .map((d: VersionDependency) => d.project_id)
            .filter((id): id is string => id != null) : [];

        const datapacksProjects = selectedDatapacks.map((d: ProjectVersion) => d.project_id);
        const modsProjects = selectedMods.map((m: ProjectVersion) => m.project_id);

        const deps = allProjects.filter(p => dependenciesIds.includes(p.id));
        const project = allProjects.find(p => p.id === selectedInstance?.project_id);
        const datapacks = allProjects.filter(p => datapacksProjects.includes(p.id));
        const mods = allProjects.filter(p => modsProjects.includes(p.id));

        return { dependencies: deps, mainProject: project, datapacks, mods, isLoading };
    }, [allProjects, selectedInstance, selectedDatapacks, selectedMods, isLoading]);

    return projectData;
}