import { type ReactNode } from 'react';

export const GlassCard = ({ children, className = "", onClick = (() => null) }: { children: ReactNode, className?: string, onClick?: () => void }) => (
	<div className={`bg-white/10 border border-white/20 rounded-2xl shadow-sm md:shadow-xl md:backdrop-blur-md ${className}`}
		onClick={onClick}
	>
		{children}
	</div>
);