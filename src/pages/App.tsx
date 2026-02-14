import { useState, useMemo, Suspense, useCallback, useDeferredValue } from 'react';
import { useAppStore } from '@stores/useStore';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelectionFeedback } from '@features/App/hooks/useSelectionFeedback';
import { useProjectData } from '@features/App/hooks/useProjectData';
import {
	BuildButton,
	BuildManager,
	FilterSidebar,
	LoaderBar,
	ModpackDetail,
	SearchBar,
    SearchResult,
    SelectedItemsManager,
} from '@features/App';
import { useShallow } from 'zustand/react/shallow';
import type { Category } from '@/types';
import UI from '@/ui';

const App = () => {
    const { t } = useTranslation();

    const [pageOffset, setPageOffset] = useState<number>(0);
    const [modpackQuery, setModpackQuery] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [showSelectedItemsManager, setShowSelectedItemsManager] = useState<boolean>(false);
    const [showBuildManager, setShowBuildManager] = useState<boolean>(false);

	const { selectedVersion, selectedLoader, setSelectedLoader } = useAppStore(
		useShallow((state) => ({
			selectedVersion: state.selectedVersion,
			selectedLoader: state.selectedLoader,
			setSelectedLoader: state.setSelectedLoader,
		}))
	);

    const deferredQuery = useDeferredValue(modpackQuery);

    const searchParams = useMemo(() => {
        const projectTypesFacet: { [key: string]: string[] } = {};
        if (selectedLoader && selectedLoader.supported_project_types) {
            projectTypesFacet["project_type"] = Object.values(selectedLoader.supported_project_types);
        }
        if (selectedTypes.length > 0 && selectedLoader?.name !== "datapack") {
            if (projectTypesFacet["project_type"] && Object.keys(projectTypesFacet).length > 0) {
                projectTypesFacet["project_type"] = projectTypesFacet["project_type"].filter(type =>
                    selectedTypes.includes(type)
                );
            } else {
                projectTypesFacet["project_type"] = selectedTypes;
            }
        }

        if (Object.keys(projectTypesFacet).length < 1) {
            projectTypesFacet["project_type"] = ["modpack", "datapack", "mod"];
        }

        if (selectedVersion) {
            projectTypesFacet['versions'] = [selectedVersion];
        }

        return {
            query: deferredQuery,
            loader: selectedLoader?.name,
            categories: selectedCategories.map((c) => c.name),
            facets: projectTypesFacet,
            offset: pageOffset
        };
    }, [deferredQuery, pageOffset, selectedCategories, selectedLoader, selectedVersion, selectedTypes]);

    const projectData = useProjectData();

    const handleManageSelection = useCallback(() => {
        setShowSelectedItemsManager(true);
    }, []);

    const handleBuild = useCallback(() => {
        setShowBuildManager(true);
    }, []);

    useSelectionFeedback(handleManageSelection, (showSelectedItemsManager || showBuildManager), projectData.mainProject);

    const hasSelectedProject = useAppStore((s) => s.selectedProject !== null);

    return (
        <UI.Page locked={hasSelectedProject}>
            <UI.Header />
            <ModpackDetail />
            <UI.SnackbarContainer />

            {showBuildManager && (
                <div className="fixed inset-0 z-50 flex backdrop-blur-md animate-in fade-in duration-300">
                    <Suspense fallback={<UI.Loading size="lg" />}>
                        {projectData.isLoading ? (
                            <UI.Loading size="lg" />
                        ) : (
                            <BuildManager onClose={() => setShowBuildManager(false)} projects={projectData} manageButton={handleManageSelection} />
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
                            <SelectedItemsManager onClose={() => setShowSelectedItemsManager(false)} projects={projectData} />
                        )}
                    </Suspense>
                </div>
            )}


            <main className="max-w-[85%] max-h-[80vh] mx-auto px-6 py-8 grid grid-cols-12 gap-8">
                <aside className="col-span-4">
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

                <section className="col-span-8 space-y-6">
                    <div className="flex items-center justify-between glass-panel p-2">
                        <Suspense fallback={<UI.Loading size="sm" />}>
                            <LoaderBar
                                selectedLoader={selectedLoader}
                                setSelectedLoader={setSelectedLoader}
                            />
                        </Suspense>
                        <SearchBar
                            value={modpackQuery}
                            onChange={setModpackQuery}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Layers size={18} />
                            <h2 className="font-bold select-none">
                                {!selectedLoader?.name ? t('Popular Modpacks and Datapacks')
                                    : selectedLoader.name === "datapack" ? t('Popular Datapacks')
                                        : t('Popular Modpacks')}
                            </h2>
                        </div>
                        <Suspense fallback={<UI.Loading size='lg' />}>
                            <SearchResult
                                params={searchParams}
                                page={pageOffset}
                                setPage={setPageOffset}
                            />
                        </Suspense>
                    </div>
                </section>
            </main>
        </UI.Page>
    );
};

export default App;