import { useSnackbar } from "../stores/useSnackbar";
import { Snackbar } from "./components/Snackbar";

export const SnackbarContainer = () => {
	const snackbars = useSnackbar((state) => state.snackbars);

	return (
		<div className="fixed bottom-12 left-12 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none">
			{snackbars.map((snackbar) => (
				<div key={snackbar.id} className="pointer-events-auto">
					<Snackbar {...snackbar} />
				</div>
			))}
		</div>
	);
};