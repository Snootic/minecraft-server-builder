import { memo } from "react";
import { useConstantData } from "./hooks/useConstantData";
import type { Loader } from "@/types";
import UI from "@/ui";

const LoaderBar = memo(({ selectedLoader, setSelectedLoader }: {
    selectedLoader: Loader | null;
    setSelectedLoader: (loader: Loader | null) => void;
}) => {
    const { loaders } = useConstantData();
    return (
        <UI.Components.ButtonGroup
            items={loaders}
            selectedItem={selectedLoader}
            onSelect={setSelectedLoader}
            getKey={(l) => l.name}
            getLabel={(l) => l.name.charAt(0).toUpperCase() + l.name.slice(1)}
            getIcon={(l) => l.icon}
        />
    );
}, (prevProps, nextProps) => {
    return prevProps.selectedLoader === nextProps.selectedLoader;
});

export default LoaderBar;