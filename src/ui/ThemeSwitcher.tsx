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

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', current);
		localStorage.setItem('theme', current);
	}, [current]);

	return (
		<div className="flex gap-2 bg-black/20 p-1.5 rounded-full border border-white/5">
			<Palette color={themes.find(t => t.id === current)?.color} />
			{themes.map((t) => (
				<button
					key={t.id}
					onClick={() => setCurrent(t.id)}
					className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${current === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''
						}`}
					style={{ backgroundColor: t.color }}
					title={t.label}
				/>
			))}
		</div>
	);
});