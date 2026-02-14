import * as Components from './components'
import SearchResult from './SearchResult'

type SearchResultType = typeof SearchResult;

interface SearchResultWithComponents extends SearchResultType {
	Components: typeof Components;
}

const SearchResultExport = SearchResult as SearchResultWithComponents;
SearchResultExport.Components = Components;

export default SearchResultExport;
