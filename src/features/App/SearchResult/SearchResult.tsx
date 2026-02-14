import { useSearch } from "@/api/modrinth";
import { ProjectGrid } from "./components";

type queryParams = {
    categories?: string[] | undefined;
    facets?: Record<string, string[]>;
    query?: string;
    offset?: number;
    loader?: string;
}

type SearchResultProps = {
    params: queryParams,
    page: number,
    setPage: (page: number) => void
}

const SearchResult = ({ params, page, setPage }: SearchResultProps) => {
    const { data: searchResults } = useSearch(params);

    return (
        <ProjectGrid
            searchResults={searchResults}
            page={page}
            setPage={setPage}
        />
    );
};

export default SearchResult;