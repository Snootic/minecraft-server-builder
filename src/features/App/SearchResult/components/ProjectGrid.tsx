import { Download, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { ProjectSearchResults } from '@/types';
import { useAppStore } from '@/stores/useStore';
import UI from '@/ui';

interface ProjectGridProps {
	searchResults: { hits: ProjectSearchResults['hits'], total_hits: ProjectSearchResults['total_hits'] }
	page: number
	setPage: (page: number) => void
}

const ProjectGrid = ({ searchResults, page, setPage }: ProjectGridProps) => {
	const { t } = useTranslation()

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

	const { setSelectedProject } = useAppStore()

	const startIndex = page % 2 === 0 ? 0 : 10
	const endIndex = startIndex + 10

	const projectsToShow = projects.slice(startIndex, endIndex)

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{projectsToShow.map((pack) => (
				<UI.GlassCard
					key={pack.project_id}
					className={`${selectedProjects.includes(pack.project_id) ? '!bg-[var(--primary)]/80' : ''} p-4 flex gap-4 hover:border-[var(--glass-border)] transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]`}
					onClick={() => setSelectedProject(pack)}
				>
					<div className="relative shrink-0">
						{pack.icon_url ? (
							<img src={pack.icon_url} alt={pack.title} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
						) : (
							<div className="w-20 h-20 bg-[var(--glass-bg)] rounded-xl flex items-center justify-center">
								<Layers className="text-[var(--glass-bg)]" />
							</div>
						)}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start">
							<h3 className={`font-bold text-lg truncate transition-colors ${selectedProjects.includes(pack.project_id) ? 'group-hover:!text-[var(--bg-surface-dark)]' : 'group-hover:text-[var(--accent)]'}`}>{pack.title}</h3>
						</div>
						<p className={`text-slate-400 text-xs line-clamp-2 mt-1 mb-3 ${selectedProjects.includes(pack.project_id) ? '!text-[var(--bg-surface-light)]/80 group-hover:!text-[var(--bg-surface-dark)]' : ''}`}>{pack.description}</p>
						<div className="flex items-center justify-between text-[10px] font-bold">
							<span className={`flex items-center gap-1 text-slate-500 ${selectedProjects.includes(pack.project_id) ? '!text-[var(--bg-surface-light)]/80  group-hover:!text-[var(--bg-surface-dark)]' : ''}`}>
								<Download size={10} /> {pack.downloads.toLocaleString()}
							</span>
							<span className={`text-slate-300 bg-white/5 px-2 py-0.5 rounded text-xs opacity-60 ${selectedProjects.includes(pack.project_id) ? '!text-[var(--bg-surface-light)]/80  group-hover:!text-[var(--bg-surface-dark)]' : ''}`}>
								{pack.author}
							</span>
						</div>
					</div>
				</UI.GlassCard>
			))}
			<div className="col-span-full flex justify-center items-center mt-4">
				{Array.from({ length: page }).map((_, idx) => {
					const pageNum = idx + 1;

					if (pageNum > 0 && pageNum < 4) {
						return (
							<button
								key={pageNum}
								className="mx-1 bg-secondary hover:bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shadow transition"
								onClick={() => setPage(pageNum - 1)}
							>
								{pageNum}
							</button>
						);
					}

					if (pageNum >= (page - 2)) {
						return (
							<button
								key={pageNum}
								className="mx-1 bg-secondary hover:bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shadow transition"
								onClick={() => setPage(pageNum - 1)}
							>
								{pageNum}
							</button>
						);
					}

					if (idx === 3) {
						return (<span key={`page-ellipsis`} className="mx-1 text-slate-400">...</span>);
					}
					return null;

				})}
				{(projects.length - 10) > 0 && (
					<button
						className="bg-primary hover:bg-accent text-white p-1 h-8 rounded-full flex items-center justify-center shadow transition"
						onClick={() => setPage(page + 1)}
					>
						{page + 1} - {t("Next")}
					</button>
				)}
				{totalProjects > 10 && (
					<>
						{[page + 2, page + 3].map((p) => {
							const maxPage = Math.ceil(totalProjects / 10);
							if (p <= maxPage && p !== page + 1) {
								return (
									<button
										key={p}
										className="mx-1 bg-secondary hover:bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shadow transition"
										onClick={() => setPage(p - 1)}
									>
										{p}
									</button>
								);
							}
							return null;
						})}
						{page + 4 < Math.ceil(totalProjects / 10) && (
							<span className="mx-1 text-slate-400">...</span>
						)}
						{(page + 1) !== Math.ceil(totalProjects / 10) && (
							<button
								className="mx-1 bg-secondary hover:bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shadow transition"
								onClick={() => setPage(Math.ceil(totalProjects / 10) - 1)}
							>
								{Math.ceil(totalProjects / 10)}
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default ProjectGrid;