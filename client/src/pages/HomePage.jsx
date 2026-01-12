import GigCard from '../components/ui/GigCard'
import SearchBar from '../components/ui/SearchBar'
import { authAPI, gigsAPI } from '../api/axios'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Briefcase, Check, DollarSign } from 'lucide-react'

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('')

    const {
        data: gigsData,
        isLoading: gigsLoading,
        isError: gigsError,
        error: gigsErrorObj,
        refetch: refetchGigs
    } = useQuery({
        queryKey: ['gigs', searchQuery],
        queryFn: () => gigsAPI.browse(searchQuery),
        keepPreviousData: true, 
    })
    const gigs = gigsData?.gigs || []

    const {
        data: statsData,
        isLoading: statsLoading,
    } = useQuery({
        queryKey: ['freelancer-stats'],
        queryFn: authAPI.getStats,
    })

    const stats = statsData
        ? [
            {
                title: "Total Revenue",
                value: `$${statsData.stats.totalRevenue || 0}`,
                desc: "Revenue from hired gigs",
                icon: <DollarSign className="w-6 h-6 stroke-3 text-neutral" />,
            },
            {
                title: "Total Gigs Applied",
                value: statsData.stats.totalGigsApplied || 0,
                desc: "All-time bids placed",
                icon: <Briefcase className="w-6 h-6 stroke-3 text-neutral" />,
            },
            {
                title: "Total Gigs Hired",
                value: statsData.stats.totalGigsHired || 0,
                desc: "Bids successfully hired",
                icon: <Check className="w-6 h-6 stroke-3 text-neutral" />,
            },
        ]
        : []

    const handleSearchChange = (query) => {
        setSearchQuery(query)
        refetchGigs()
    }

    return (
        <div className="grid grid-cols-6 gap-4">
            {/* LEFT: Gigs */}
            <section className="divide-y divide-base-300 col-span-6 md:col-span-4 space-y-1">
                <SearchBar value={searchQuery} onChange={handleSearchChange} />

                {gigsLoading && (
                    <div className="p-6 text-center text-base-content/60">
                        Loading gigs...
                    </div>
                )}

                {gigsError && (
                    <div className="p-6 text-center text-error">
                        {gigsErrorObj.message || 'Something went wrong'}
                    </div>
                )}

                {!gigsLoading && !gigsError && gigs.length === 0 && (
                    <div className="p-6 text-center text-base-content/60">
                        <p className="text-lg font-semibold">No gigs found</p>
                        <p className="text-sm">
                            Try searching with different keywords 🚀
                        </p>
                    </div>
                )}

                {!gigsLoading && !gigsError &&
                    gigs.map(gig => <GigCard key={gig._id} gig={gig} />)
                }
            </section>

            {/* RIGHT: Stats */}
            <div className="col-span-2 hidden md:flex flex-col gap-4">
                {statsLoading && (
                    <div className="p-6 text-center text-base-content/60">
                        Loading stats...
                    </div>
                )}

                {!statsLoading && stats.map((stat, index) => (
                    <div key={index} className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure">{stat.icon}</div>
                            <div className="stat-title">{stat.title}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-desc">{stat.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
