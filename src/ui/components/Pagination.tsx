import { Fragment, memo } from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    compact?: boolean;
}

interface PageButtonProps {
    active?: boolean;
    onClick?: () => void;
    pageNumber: number;
    compact?: boolean;
}

const PageButton = ({ active = false, onClick, pageNumber, compact = false }: PageButtonProps) => (
    <button
        type="button"
        className={`${compact ? "mx-0.5 min-w-7 h-7 px-1.5 text-xs" : "mx-1 min-w-8 h-8 px-2"} rounded-full flex items-center justify-center shadow transition text-white ${active ? "bg-primary hover:bg-accent" : "bg-secondary hover:bg-accent"}`}
        onClick={onClick}
    >
        {pageNumber}
    </button>
);

export const Pagination = memo(({ page, setPage, totalPages, compact = false }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const currentPage = page + 1;
    const previousPages = Array.from({ length: currentPage - 1 }, (_, idx) => idx + 1).filter((pageNum) => (
        pageNum <= 3 || pageNum >= currentPage - 3
    ));
    const previousEllipsis = previousPages.length > 0 &&
        previousPages[previousPages.length - 1] - previousPages[0] + 1 !== previousPages.length;
    const nextPages = [currentPage + 1, currentPage + 2].filter((pageNum) => pageNum < totalPages);

    return (
        <div className={`relative col-span-full flex justify-center items-center ${compact ? "mt-2" : "mt-4"}`}>
            {previousPages.map((pageNum, idx) => (
                <Fragment key={pageNum}>
                    {previousEllipsis && idx === 3 && (
                        <span className={`${compact ? "mx-0.5 text-xs" : "mx-1"} text-slate-400`}>...</span>
                    )}
                    <PageButton compact={compact} pageNumber={pageNum} onClick={() => setPage(pageNum - 1)} />
                </Fragment>
            ))}
            <PageButton compact={compact} active pageNumber={currentPage} />
            {nextPages.map((pageNum) => (
                <PageButton
                    key={pageNum}
                    compact={compact}
                    pageNumber={pageNum}
                    onClick={() => setPage(pageNum - 1)}
                />
            ))}
            {currentPage + 3 < totalPages && (
                <span className={`${compact ? "mx-0.5 text-xs" : "mx-1"} text-slate-400`}>...</span>
            )}
            {currentPage !== totalPages && (
                <PageButton
                    compact={compact}
                    pageNumber={totalPages}
                    onClick={() => setPage(totalPages - 1)}
                />
            )}
        </div>
    );
});
