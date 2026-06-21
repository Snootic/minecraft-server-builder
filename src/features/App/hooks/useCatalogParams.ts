import { useCallback, useMemo } from "react";
import { useLoaders } from "@/api/modrinth";
import { useUrlState } from "@/hooks/useUrlState";
import type { Loader } from "@/types";

const PAGE_PARAM = "page";
const QUERY_PARAM = "q";
const LOADER_PARAM = "loader";
const VERSION_PARAM = "version";
const PROJECT_PARAM = "project";
const CATEGORY_PARAM = "category";
const TYPE_PARAM = "type";
type HistoryMode = "push" | "replace";

const parsePage = (value: string | null) => {
    const parsed = Number.parseInt(value ?? "0", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

export const useCatalogParams = () => {
    const { data: loaders } = useLoaders();
    const { searchParams, updateSearchParams } = useUrlState();

    const query = searchParams.get(QUERY_PARAM) ?? "";
    const page = parsePage(searchParams.get(PAGE_PARAM));
    const selectedVersion = searchParams.get(VERSION_PARAM);
    const selectedLoaderName = searchParams.get(LOADER_PARAM);
    const selectedCategories = unique(searchParams.getAll(CATEGORY_PARAM));
    const selectedTypes = unique(searchParams.getAll(TYPE_PARAM));
    const selectedProjectId = searchParams.get(PROJECT_PARAM);

    const selectedLoader = useMemo<Loader | null>(
        () => loaders.find((loader) => loader.name === selectedLoaderName) ?? null,
        [loaders, selectedLoaderName],
    );

    const setSingleValueParam = useCallback(
        (
            key: string,
            value: string | null,
            options?: { resetPage?: boolean; historyMode?: HistoryMode },
        ) => {
            updateSearchParams((params) => {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                if (options?.resetPage) {
                    params.delete(PAGE_PARAM);
                }
            }, options?.historyMode);
        },
        [updateSearchParams],
    );

    const setListParam = useCallback(
        (key: string, values: string[]) => {
            updateSearchParams((params) => {
                params.delete(key);
                unique(values).forEach((value) => params.append(key, value));
                params.delete(PAGE_PARAM);
            });
        },
        [updateSearchParams],
    );

    const setQuery = useCallback(
        (value: string) => {
            setSingleValueParam(QUERY_PARAM, value || null, { resetPage: true });
        },
        [setSingleValueParam],
    );

    const setPage = useCallback(
        (value: number) => {
            setSingleValueParam(PAGE_PARAM, value > 0 ? String(value) : null);
        },
        [setSingleValueParam],
    );

    const setSelectedLoader = useCallback(
        (loader: Loader | null) => {
            setSingleValueParam(LOADER_PARAM, loader?.name ?? null, {
                resetPage: true,
            });
        },
        [setSingleValueParam],
    );

    const setSelectedVersion = useCallback(
        (version: string | null) => {
            setSingleValueParam(VERSION_PARAM, version, { resetPage: true });
        },
        [setSingleValueParam],
    );

    const setSelectedCategories = useCallback(
        (categories: string[]) => {
            setListParam(CATEGORY_PARAM, categories);
        },
        [setListParam],
    );

    const setSelectedTypes = useCallback(
        (types: string[]) => {
            setListParam(TYPE_PARAM, types);
        },
        [setListParam],
    );

    const setSelectedProjectId = useCallback(
        (projectId: string | null, historyMode: HistoryMode = "replace") => {
            setSingleValueParam(PROJECT_PARAM, projectId, { historyMode });
        },
        [setSingleValueParam],
    );

    return {
        page,
        query,
        selectedLoader,
        selectedVersion,
        selectedCategories,
        selectedTypes,
        selectedProjectId,
        setPage,
        setQuery,
        setSelectedLoader,
        setSelectedVersion,
        setSelectedCategories,
        setSelectedTypes,
        setSelectedProjectId,
    };
};
