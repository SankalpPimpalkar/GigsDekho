import { useState, useMemo } from 'react';
import SearchBar from '../components/ui/SearchBar';
import AppliedGigCard from '../components/ui/AppliedGigCard';
import { PlusCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router";
import CreateGigModal from '../components/modals/CreateGigModal';
import { gigsAPI } from "../api/axios";

export default function MyApplications() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: gigsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['gigs-applications'],
        queryFn: gigsAPI.applications,
    });

    const gigs = gigsData?.gigs || [];

    // Filter gigs locally based on searchQuery
    const filteredGigs = useMemo(() => {
        if (!searchQuery.trim()) return gigs;

        const query = searchQuery.toLowerCase();
        return gigs.filter(gig =>
            gig.title.toLowerCase().includes(query) ||
            gig.description.toLowerCase().includes(query)
        );
    }, [searchQuery, gigs]);

    return (
        <div className="grid grid-cols-6 gap-4">

            {/* Main Content */}
            <section className="col-span-6 md:col-span-4 space-y-2">
                <h3 className="text-xl font-extrabold">
                    Your Applications
                </h3>

                <SearchBar value={searchQuery} onChange={setSearchQuery} />

                {isLoading && (
                    <div className="p-6 text-center text-base-content/60">
                        Loading gigs...
                    </div>
                )}

                {isError && (
                    <div className="p-6 text-center text-error">
                        {error.message || 'Something went wrong'}
                    </div>
                )}

                {!isLoading && !isError && filteredGigs.length === 0 && (
                    <div className="p-6 text-center text-base-content/60">
                        <p className="text-lg font-semibold">No gigs found</p>
                        <p className="text-sm">
                            Try adjusting your search or start applying for new gigs 🚀
                        </p>
                    </div>
                )}

                {!isLoading && !isError &&
                    filteredGigs.map(gig => (
                        <AppliedGigCard key={gig._id} gig={gig} />
                    ))
                }
            </section>

            {/* Right Sidebar */}
            <section className="col-span-6 md:col-span-2 hidden md:flex flex-col gap-4">
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body space-y-3">
                        <h4 className="font-bold text-lg">
                            Post a New Gig
                        </h4>

                        <p className="text-sm text-base-content/70">
                            Looking to hire freelancers?
                            Create a gig and start receiving proposals.
                        </p>

                        <button
                            className="btn btn-neutral gap-2"
                            onClick={() => document.getElementById('create_gig_modal').showModal()}
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Gig
                        </button>
                    </div>
                </div>
            </section>

            <CreateGigModal />
        </div>
    );
}
