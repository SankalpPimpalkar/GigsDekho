import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
    return (
        <label className="input border w-full rounded-md shadow-sm shadow-neutral-50 flex items-center gap-2 px-2">
            <Search className='size-5 text-secondary' />
            <input
                type="search"
                required
                placeholder="Search gigs..."
                className="w-full border-none outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    )
}
