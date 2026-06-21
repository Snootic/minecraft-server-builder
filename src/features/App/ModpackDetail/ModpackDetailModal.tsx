import { memo, Suspense } from 'react';
import ModpackDetail from './ModpackDetail';
import { useCatalogParams } from '../hooks/useCatalogParams';
import UI from '@/ui';

const ModpackDetailModal = memo(() => {
    const { selectedProjectId, setSelectedProjectId } = useCatalogParams();

    if (!selectedProjectId) return null;

    return (
        <div
            className="modal-overlay fixed inset-0 z-50 flex animate-in fade-in duration-300 items-center justify-center"
            onClick={() => setSelectedProjectId(null)}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <Suspense fallback={<UI.Loading size="lg" />}>
                    <ModpackDetail
                        projectId={selectedProjectId}
                        onClose={() => setSelectedProjectId(null)}
                    />
                </Suspense>
            </div>
        </div>
    );
});

export default ModpackDetailModal;