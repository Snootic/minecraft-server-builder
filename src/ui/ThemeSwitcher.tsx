import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { memo } from 'react';

const themes = [
	{ id: 'default', color: '#10b981', label: 'Emerald' },
	{ id: 'midnight', color: '#6366f1', label: 'Indigo' },
	{ id: 'rose', color: '#f43f5e', label: 'Rose' },
];

export const ThemeSwitcher = memo(() => {
	const [current, setCurrent] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		return savedTheme && themes.some(t => t.id === savedTheme) ? savedTheme : 'default';
  });
	
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', current);
		localStorage.setItem('theme', current);
  }, [current]);
	
	const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

	return (
	<div className="flex flex-col gap-2 bg-black/20 p-1.5 rounded-full border border-white/5 md:flex-row relative">
		<Palette
				color={themes.find(t => t.id === current)?.color}
        onClick={() => { if (isSmallScreen) setExpanded(prev => !prev) }}
        onMouseLeave={() => { if (isSmallScreen) setExpanded(false) }}
        onMouseEnter={() => { if(isSmallScreen) setExpanded(true) }}
				className="cursor-pointer md:cursor-default"
		/>
		<div className={`gap-2 flex flex-col absolute top-full left-0 right-0 bg-black/20 rounded-full border border-white/5 p-1.5 transition-all duration-100 ease-out ${expanded ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'} md:static md:flex-row md:bg-transparent md:border-0 md:p-0 md:opacity-100 md:translate-y-0 md:pointer-events-auto`}>
			{themes.map((t) => (
				<button
					key={t.id}
					onClick={() => setCurrent(t.id)}
					className={`select-none w-6 h-6 rounded-full transition-transform hover:scale-110 ${current === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''
						}`}
					style={{ backgroundColor: t.color }}
					title={t.label}
				/>
			))}
		</div>
	</div>
	);
});