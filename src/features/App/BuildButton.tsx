import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useVersionIncompatibilities } from './hooks/useVersionIncompatibilities';
import { useLoaderIncompatibilities } from './hooks/useLoaderIncompatibilities';
import { useAppStore } from '@/stores/useStore';

interface BuildButtonProps {
    onClick: () => void;
}

const BuildButton = memo(({ onClick }: BuildButtonProps) => {
    const { t } = useTranslation();
    const {incompatible: versionIncompatible} = useVersionIncompatibilities()
    const {incompatible: loaderIncompatible} = useLoaderIncompatibilities()

    const canContinue = useAppStore(
        useShallow((s) => s.selectedDatapacks.length === 0 && !s.selectedInstance && s.selectedMods.length === 0)
    );

    const hasIncompatibilities = versionIncompatible || loaderIncompatible;

    if (canContinue) return null;

    return (
        <button
            onClick={onClick}
            disabled={hasIncompatibilities}
            className={`
                w-[70%] md:w-full md:mt-4 px-4 py-2 md:py-6 rounded-xl font-bold text-lg
                transition-all duration-300
                ${hasIncompatibilities
                    ? 'bg-red-500/90 hover:bg-red-600 text-white cursor-not-allowed'
                    : 'bg-(--accent) hover:bg-(--accent)/80 text-(--bg-surface-light) cursor-pointer'
                }
                shadow-lg hover:shadow-xl
            `}
        >
            {hasIncompatibilities ? t("Incompatibilities found, fix them first.") : t('Build Server')}
        </button>
    );
}, (prev, next) => {
    return prev.onClick === next.onClick;
});

export default BuildButton;