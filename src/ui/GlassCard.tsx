import { type ReactNode } from 'react';

export const GlassCard = ({ children, className = "", onClick = (() => null) }: { children: ReactNode, className?: string, onClick?: () => void }) => (
	<div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl ${className}`}
		onClick={onClick}
	>
		{children}
	</div>
);