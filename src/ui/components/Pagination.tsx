import { Fragment, memo } from "react";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

interface PageButtonProps {
    active?: boolean;
    onClick?: () => void;
    pageNumber: number;
}

const PageButton = ({ active = false, onClick, pageNumber }: PageButtonProps) => (
    <button
        type="button"
        className={`mx-1 min-w-8 h-8 px-2 rounded-full flex items-center justify-center shadow transition text-white ${active ? "bg-primary hover:bg-accent" : "bg-secondary hover:bg-accent"}`}
        onClick={onClick}
    >
        {pageNumber}
    </button>
);

export const Pagination = memo(({ page, setPage, totalPages }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const currentPage = page + 1;
    const previousPages = Array.from({ length: currentPage - 1 }, (_, idx) => idx + 1).filter((pageNum) => (
        pageNum <= 3 || pageNum >= currentPage - 3
    ));
    const previousEllipsis = previousPages.length > 0 &&
        previousPages[previousPages.length - 1] - previousPages[0] + 1 !== previousPages.length;
    const nextPages = [currentPage + 1, currentPage + 2].filter((pageNum) => pageNum < totalPages);

    return (
        <div className="relative col-span-full flex justify-center items-center mt-4">
            {previousPages.map((pageNum, idx) => (
                <Fragment key={pageNum}>
                    {previousEllipsis && idx === 3 && (
                        <span className="mx-1 text-slate-400">...</span>
                    )}
                    <PageButton pageNumber={pageNum} onClick={() => setPage(pageNum - 1)} />
                </Fragment>
            ))}
            <PageButton active pageNumber={currentPage} />
            {nextPages.map((pageNum) => (
                <PageButton
                    key={pageNum}
                    pageNumber={pageNum}
                    onClick={() => setPage(pageNum - 1)}
                />
            ))}
            {currentPage + 3 < totalPages && (
                <span className="mx-1 text-slate-400">...</span>
            )}
            {currentPage !== totalPages && (
                <PageButton
                    pageNumber={totalPages}
                    onClick={() => setPage(totalPages - 1)}
                />
            )}
        </div>
    );
});
