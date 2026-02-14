import type { Project } from '../../types';
import { CheckboxList } from './CheckboxList';

interface ProjectListProps {
	projects: Project[];
	emptyMessage: string;
	manageableList?: Project[]
	setManageableList?: React.Dispatch<React.SetStateAction<Project[]>>
}

export const ProjectList = ({ emptyMessage, projects, manageableList, setManageableList }: ProjectListProps) => {
	if (!projects || projects.length === 0) {
		return <span className="text-slate-400">{emptyMessage}</span>;
	}

	const renderItem = (project: Project) => (
		<li key={`project-${project.id}`} className="flex items-center gap-2 text-slate-200">
			<img src={project.icon_url ?? ''} alt="" className="w-5 h-5 object-contain" />
			{project.title}
		</li>
	);

	if (manageableList && setManageableList) {
		return (
			<CheckboxList
				items={projects}
				selectedItems={manageableList}
				onToggle={(p: Project) =>
					setManageableList((prev: Project[]) =>
						prev?.includes(p) ? prev.filter(project => project !== p) : [...prev, p]
					)
				}
				getKey={(p: Project) => p.id}
				getLabel={(p: Project) => p.title}
				getIcon={(p: Project) => p.icon_url ?? ""}
				columns={1}
			/>
		)
	}

	return (
		<ul className="list-disc list-inside">
			{projects.map(renderItem)}
		</ul>
	);
};