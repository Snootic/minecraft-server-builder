import { Download, Layers } from 'lucide-react';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { ProjectSearchResults } from '@/types';
import { useAppStore } from '@/stores/useStore';
import { useCatalogParams } from '../../hooks/useCatalogParams';
import UI from '@/ui';

interface ProjectGridProps {
	searchResults: { hits: ProjectSearchResults['hits'], total_hits: ProjectSearchResults['total_hits'] }
	page: number
	setPage: (page: number) => void
}

const ProjectGrid = ({ searchResults, page, setPage }: ProjectGridProps) => {
	const { selectedInstance, selectedDatapacks, selectedMods } = useAppStore(
		useShallow((state) => ({
			selectedInstance: state.selectedInstance,
			selectedDatapacks: state.selectedDatapacks,
			selectedMods: state.selectedMods,
		}))
	);

	const selectedProjects = useMemo(() => [
		...(selectedInstance ? [selectedInstance.project_id] : []),
		...selectedDatapacks.map(d => d.project_id),
		...selectedMods.map(m => m.project_id)
	], [selectedInstance, selectedDatapacks, selectedMods]);

	const results = searchResults
	const projects = results.hits
	const totalProjects = results.total_hits

	const { setSelectedProjectId } = useCatalogParams();

	const startIndex = page % 2 === 0 ? 0 : 10
	const endIndex = startIndex + 10

	const projectsToShow = projects.slice(startIndex, endIndex)
	const totalPages = Math.ceil(totalProjects / 10)

	return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{projectsToShow.map((pack) => (
				<UI.GlassCard
					key={pack.project_id}
					className={`${selectedProjects.includes(pack.project_id) ? 'bg-(--primary)/80!' : ''} p-4 flex gap-4 hover:border-(--glass-border) transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]`}
						onClick={() => setSelectedProjectId(pack.project_id)}
					>
					<div className="relative shrink-0">
						{pack.icon_url ? (
							<img src={pack.icon_url} alt={pack.title} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
						) : (
							<div className="w-20 h-20 bg-(--glass-bg) rounded-xl flex items-center justify-center">
								<Layers className="text-(--glass-bg)" />
							</div>
						)}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start">
							<h3 className={`font-bold text-lg truncate transition-colors ${selectedProjects.includes(pack.project_id) ? 'group-hover:text-(--bg-surface-dark)!' : 'group-hover:text-(--accent)'}`}>{pack.title}</h3>
						</div>
						<p className={`text-slate-400 text-xs line-clamp-2 mt-1 mb-3 ${selectedProjects.includes(pack.project_id) ? 'text-(--bg-surface-light)/80! group-hover:text-(--bg-surface-dark)!' : ''}`}>{pack.description}</p>
						<div className="flex items-center justify-between text-[10px] font-bold">
							<span className={`flex items-center gap-1 text-slate-500 ${selectedProjects.includes(pack.project_id) ? 'text-(--bg-surface-light)/80!  group-hover:text-(--bg-surface-dark)!' : ''}`}>
								<Download size={10} /> {pack.downloads.toLocaleString()}
							</span>
							<span className={`text-slate-300 bg-white/5 px-2 py-0.5 rounded text-xs opacity-60 ${selectedProjects.includes(pack.project_id) ? 'text-(--bg-surface-light)/80!  group-hover:text-(--bg-surface-dark)!' : ''}`}>
								{pack.author}
							</span>
						</div>
					</div>
				</UI.GlassCard>
      ))}
			
			<UI.Components.Pagination page={page} setPage={setPage} totalPages={totalPages} />
		</div>
	);
}

export default ProjectGrid;
