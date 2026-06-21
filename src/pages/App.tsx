import {
    Suspense,
    useCallback,
    useDeferredValue,
    useMemo,
    useState,
} from "react";
import { ChevronDown, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelectionFeedback } from "@features/App/hooks/useSelectionFeedback";
import { useProjectData } from "@features/App/hooks/useProjectData";
import { useCatalogParams } from "@features/App/hooks/useCatalogParams";
import {
    BuildButton,
    BuildManager,
    FilterSidebar,
    LoaderBar,
    ModpackDetail,
    SearchBar,
    SearchResult,
    SelectedItemsManager,
} from "@features/App";
import UI from "@/ui";

const App = () => {
    const { t } = useTranslation();
    const [showSelectedItemsManager, setShowSelectedItemsManager] =
        useState<boolean>(false);
    const [showBuildManager, setShowBuildManager] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState(false);

    const {
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
        setSelectedCategories,
        setSelectedTypes,
    } = useCatalogParams();

    const deferredQuery = useDeferredValue(query);

    const searchParams = useMemo(() => {
        const projectTypesFacet: { [key: string]: string[] } = {};

        if (selectedLoader?.supported_project_types) {
            projectTypesFacet.project_type = Object.values(
                selectedLoader.supported_project_types,
            );
        }

        if (selectedTypes.length > 0 && selectedLoader?.name !== "datapack") {
            if (projectTypesFacet.project_type) {
                projectTypesFacet.project_type =
                    projectTypesFacet.project_type.filter((type) =>
                        selectedTypes.includes(type),
                    );
            } else {
                projectTypesFacet.project_type = selectedTypes;
            }
        }

        if (!projectTypesFacet.project_type || projectTypesFacet.project_type.length < 1) {
            projectTypesFacet.project_type = ["modpack", "datapack", "mod"];
        }

        if (selectedVersion) {
            projectTypesFacet.versions = [selectedVersion];
        }

        return {
            query: deferredQuery,
            loader: selectedLoader?.name,
            categories: selectedCategories,
            facets: projectTypesFacet,
            offset: page,
        };
    }, [
        deferredQuery,
        page,
        selectedCategories,
        selectedLoader,
        selectedTypes,
        selectedVersion,
    ]);

    const projectData = useProjectData();

    const handleManageSelection = useCallback(() => {
        setShowSelectedItemsManager(true);
    }, []);

    const handleBuild = useCallback(() => {
        setShowBuildManager(true);
    }, []);

    useSelectionFeedback(
        handleManageSelection,
        showSelectedItemsManager || showBuildManager,
        projectData.mainProject,
    );

    return (
        <UI.Page locked={selectedProjectId !== null}>
            <UI.Header />
            <ModpackDetail />
            <UI.SnackbarContainer />

            {showBuildManager && (
                <div className="fixed inset-0 z-50 flex backdrop-blur-md animate-in fade-in duration-300">
                    <Suspense fallback={<UI.Loading size="lg" />}>
                        {projectData.isLoading ? (
                            <UI.Loading size="lg" />
                        ) : (
                            <BuildManager
                                onClose={() => setShowBuildManager(false)}
                                projects={projectData}
                                manageButton={handleManageSelection}
                            />
                        )}
                    </Suspense>
                </div>
            )}
            {showSelectedItemsManager && (
                <div className="fixed inset-0 z-50 flex backdrop-blur-md animate-in fade-in duration-300">
                    <Suspense fallback={<UI.Loading size="lg" />}>
                        {projectData.isLoading ? (
                            <UI.Loading size="lg" />
                        ) : (
                            <SelectedItemsManager
                                onClose={() =>
                                    setShowSelectedItemsManager(false)
                                }
                                projects={projectData}
                            />
                        )}
                    </Suspense>
                </div>
            )}

            <main className="max-w-[95%] md:max-w-[85%] max-h-[80vh] mx-auto px-4 py-4 grid grid-cols-12 gap-4 md:gap-8">
                <aside className="relative col-span-4 hidden md:flex md:flex-col">
                    <Suspense fallback={<UI.Loading size="md" />}>
                        <FilterSidebar
                            selectedCategories={selectedCategories}
                            onCategoriesChange={setSelectedCategories}
                            selectedTypes={selectedTypes}
                            onTypesChange={setSelectedTypes}
                        />
                    </Suspense>
                    <BuildButton onClick={handleBuild} />
                </aside>

                <section className="relative col-span-12 md:col-span-8 space-y-6">
                    <div className="relative z-10 grid grid-cols-2 glass-panel p-2 gap-2">
                        <div className="col-span-2 flex items-center justify-between">
                            <Suspense fallback={<UI.Loading size="sm" />}>
                                <LoaderBar
                                    selectedLoader={selectedLoader}
                                    setSelectedLoader={setSelectedLoader}
                                />
                            </Suspense>
                            <SearchBar value={query} onChange={setQuery} />
                        </div>
                        <div className="md:hidden col-span-2 flex relative justify-between">
                            <div
                                className="flex items-center justify-center gap-1 text-slate-400 cursor-pointer p-2 border border-white/10 rounded-xl"
                                onClick={() => setShowFilters((prev) => !prev)}
                            >
                                <h3>Filters</h3>
                                <ChevronDown />
                            </div>
                            <BuildButton onClick={handleBuild} />
                            <div
                                className={`absolute top-full right-0 w-full bg-(--bg-surface-light) rounded-xl border border-white/10 p-1 ${showFilters ? "block" : "hidden"}`}
                            >
                                <Suspense fallback={<UI.Loading size="md" />}>
                                    <FilterSidebar
                                        selectedCategories={selectedCategories}
                                        onCategoriesChange={setSelectedCategories}
                                        selectedTypes={selectedTypes}
                                        onTypesChange={setSelectedTypes}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Layers size={18} />
                            <h2 className="font-bold select-none">
                                {!selectedLoader?.name
                                    ? t("Popular Modpacks and Datapacks")
                                    : selectedLoader.name === "datapack"
                                      ? t("Popular Datapacks")
                                      : t("Popular Modpacks")}
                            </h2>
                        </div>
                        <Suspense fallback={<UI.Loading size="lg" />}>
                            <SearchResult
                                params={searchParams}
                                page={page}
                                setPage={setPage}
                            />
                        </Suspense>
                    </div>
                </section>
            </main>
        </UI.Page>
    );
};

export default App;
