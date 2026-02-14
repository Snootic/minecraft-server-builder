import { useState, useCallback, useRef } from 'react';

export const useDraggable = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);

	const dragStart = useRef({ x: 0, y: 0 });

	const onPointerDown = useCallback((e: React.PointerEvent) => {
		const target = e.target as HTMLElement;
		if (target.tagName === 'BUTTON' || target.closest('button')) return;

		e.preventDefault();
		e.stopPropagation();

		setIsDragging(true);

		dragStart.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y
		};

		(e.target as Element).setPointerCapture(e.pointerId);
	}, [position]);

	const onPointerMove = useCallback((e: React.PointerEvent) => {
		if (!isDragging) return;

		e.preventDefault();
		setPosition({
			x: e.clientX - dragStart.current.x,
			y: e.clientY - dragStart.current.y
		});
	}, [isDragging]);

	const onPointerUp = useCallback((e: React.PointerEvent) => {
		setIsDragging(false);
		(e.target as Element).releasePointerCapture(e.pointerId);
	}, []);

	return {
		position,
		isDragging,
		dragHandlers: {
			onPointerDown,
			onPointerMove,
			onPointerUp
		}
	};
};