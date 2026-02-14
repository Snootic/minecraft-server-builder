import { Loader2 } from 'lucide-react';
import { Page } from './Page';

interface LoadingProps {
	message?: string;
	size?: 'sm' | 'md' | 'lg';
	fullScreen?: boolean;
}

export const Loading = ({ message, size = 'md', fullScreen = false }: LoadingProps) => {
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
	};

	const LoadingContent = (
		<div className="flex flex-col items-center justify-center gap-4">
			<Loader2
				className={`${sizeClasses[size]} text-primary animate-spin`}
				strokeWidth={2.5}
			/>
			{message && (
				<p className="text-slate-400 text-sm font-medium animate-pulse">
					{message}
				</p>
			)}
		</div>
	);

	if (fullScreen) {
		return (
			<Page>
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-surface/80 backdrop-blur-md">
					<div className="glass-panel p-8 rounded-2xl">
						{LoadingContent}
					</div>
				</div>
			</Page>
		);
	}

	return (
		<div className="flex items-center justify-center p-8">
			{LoadingContent}
		</div>
	);
};