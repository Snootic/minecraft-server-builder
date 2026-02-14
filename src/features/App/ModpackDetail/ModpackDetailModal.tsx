import { memo, Suspense } from 'react';
import ModpackDetail from './ModpackDetail';
import { useAppStore } from '@/stores/useStore';
import UI from '@/ui';

const ModpackDetailModal = memo(() => {
    const selectedProject = useAppStore((s) => s.selectedProject);
    const setSelectedProject = useAppStore((s) => s.setSelectedProject);

    if (!selectedProject) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex backdrop-blur-md animate-in fade-in duration-300 items-center justify-center"
            onClick={() => setSelectedProject(null)}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <Suspense fallback={<UI.Loading size="lg" />}>
                    <ModpackDetail onClose={() => setSelectedProject(null)} />
                </Suspense>
            </div>
        </div>
    );
});

export default ModpackDetailModal;