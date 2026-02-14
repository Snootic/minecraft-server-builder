import { useCallback, useEffect, useState } from "react";
import { X, GripVertical } from "lucide-react";
import { useSnackbar, type SnackbarData } from "../../stores/useSnackbar";
import { useDraggable } from "../../hooks/useDraggable";

export const Snackbar = ({ id, message, draggable = false, type = "info", duration = 3000, action, className = '', closeable = true, progress }: SnackbarData) => {
	const dismiss = useSnackbar((state) => state.dismiss);

	const [isExiting, setIsExiting] = useState(false);
	const [isEntering, setIsEntering] = useState(true);

	const { position, isDragging, dragHandlers } = useDraggable();

	const handleDismiss = useCallback(() => {
		setIsExiting(true);
		setTimeout(() => dismiss(id), 300);
	}, [dismiss, id]);

	useEffect(() => {
		const enterTimer = setTimeout(() => setIsEntering(false), 100);
		return () => clearTimeout(enterTimer);
	}, []);

	useEffect(() => {
		if (duration === 0 || isDragging || isEntering) return;

		const timer = setTimeout(handleDismiss, duration);
		return () => clearTimeout(timer);
	}, [duration, id, handleDismiss, isDragging, isEntering]);

	const typeStyles = {
		success: "bg-[var(--primary)] text-[var(--bg-surface)] border-[var(--primary)]",
		error: "bg-red-500/90 text-white border-red-600",
		info: "bg-[var(--accent)] text-[var(--bg-surface-light)] border-[var(--accent)]",
		warning: "bg-yellow-500/90 text-white border-yellow-600",
	};

	return (
		<div
			role="alert"
			{...(draggable ? dragHandlers : {})}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`,
				touchAction: 'none'
			}}
			onClick={(e) => {
				if (action && action.label === "") {
					e.stopPropagation();
					action.onClick();
				}
			}}
			className={`
				group relative flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border-2 backdrop-blur-md
				transition-all duration-300 ease-out ${typeStyles[type]}
				${isExiting ? "opacity-0 scale-80 translate-x-10" : ""}
				${isEntering ? "opacity-0 scale-80 translate-x-10" : "opacity-100 scale-100 translate-x-0"}
				${isDragging ? "cursor-grabbing z-[9999]" : draggable ? "cursor-grab z-auto" : "cursor-pointer z-auto"}
				${className}
			`}
		>
			{draggable && (
				<div className="shrink-0">
					<GripVertical size={16} />
				</div>
			)}

			<div className="flex-1 min-w-0">
				<span className={`text-sm font-medium select-none pointer-events-none ${className}`}>
					{message}
				</span>
				{progress !== undefined && (
					<div className="mt-1.5 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
						<div
							className="h-full bg-white rounded-full transition-all duration-300 ease-out"
							style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
						/>
					</div>
				)}
			</div>

			{(action && action.label !== "") && (
				<button
					onPointerDown={(e) => e.stopPropagation()}
					onClick={(e) => { e.stopPropagation(); action.onClick(); }}
					className="text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors shrink-0 cursor-pointer"
				>
					{action.label}
				</button>
			)}
			{closeable && (
				<button
					onPointerDown={(e) => e.stopPropagation()}
					onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
					className="p-1 rounded-full hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
};