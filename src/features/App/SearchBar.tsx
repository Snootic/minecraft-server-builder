import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"

interface SearchBarProps {
    value: string
    onChange: (query: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    const { t } = useTranslation()
    return (
        <div className="relative flex-1 max-w-xs mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
                placeholder={t('Quick search...')}
                value={value}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                onChange={e => onChange(e.target.value)}
            />
        </div>
    )
}

export default SearchBar