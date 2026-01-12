import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SearchBar from "../components/ui/SearchBar";
import { gigsAPI, bidsAPI } from "../api/axios";
import { Clock, User, DollarSign, CheckCircle } from "lucide-react";
import { formatDate } from "../components/ui/GigCard";

export default function MyGigs() {
    const [selectedGig, setSelectedGig] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();

    /* Fetch my gigs */
    const {
        data: myGigsData,
        isLoading: gigsLoading,
        isError: gigsError,
    } = useQuery({
        queryKey: ["my-gigs"],
        queryFn: gigsAPI.mygigs,
    });

    const myGigs = myGigsData?.gigs || [];

    // Filter gigs locally based on searchQuery
    const filteredGigs = useMemo(() => {
        if (!searchQuery.trim()) return myGigs;
        const query = searchQuery.toLowerCase();
        return myGigs.filter(
            (gig) =>
                gig.title.toLowerCase().includes(query) ||
                gig.description.toLowerCase().includes(query)
        );
    }, [searchQuery, myGigs]);

    /* Fetch bids for selected gig */
    const {
        data: bidsData,
        isLoading: bidsLoading,
    } = useQuery({
        queryKey: ["gig-bids", selectedGig?._id],
        queryFn: () => bidsAPI.fetch(selectedGig._id),
        enabled: !!selectedGig,
    });

    const bids = bidsData?.bids || [];

    /* Hire a freelancer */
    const { mutate: hireBid, isPending: hiring } = useMutation({
        mutationFn: ({ gigId, freelancerId }) => gigsAPI.hire({ gigId, freelancerId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["my-gigs"]);
            queryClient.invalidateQueries(["gig-bids", selectedGig?._id]);
        },
    });

    /* Filter bids based on gig status */
    const visibleBids =
        selectedGig?.status === "assigned"
            ? bids.filter((bid) => bid.status === "hired")
            : bids;

    return (
        <div className="grid grid-cols-6 gap-4">

            {/* LEFT: My Gigs */}
            <section className="col-span-6 md:col-span-3 space-y-2">
                <h3 className="text-xl font-extrabold">My Gigs</h3>

                <SearchBar value={searchQuery} onChange={setSearchQuery} />

                {gigsLoading && (
                    <div className="p-6 text-center text-base-content/60">
                        Loading your gigs...
                    </div>
                )}

                {gigsError && (
                    <div className="p-6 text-center text-error">
                        Failed to load gigs
                    </div>
                )}

                {!gigsLoading && filteredGigs.length === 0 && (
                    <div className="p-6 text-center text-base-content/60">
                        <p className="font-semibold">
                            No gigs match your search
                        </p>
                    </div>
                )}

                {filteredGigs.map((gig) => (
                    <div
                        key={gig._id}
                        onClick={() => setSelectedGig(gig)}
                        className={`card bg-base-100 shadow-sm cursor-pointer
                            ${selectedGig?._id === gig._id ? "ring-2 ring-primary" : ""}
                        `}
                    >
                        <div className="card-body p-4 space-y-1">
                            <h4 className="font-bold text-lg line-clamp-1">
                                {gig.title}
                            </h4>

                            <p className="text-sm text-base-content/70 line-clamp-2">
                                {gig.description}
                            </p>

                            <div className="flex justify-between text-sm text-base-content/60 pt-1">
                                <span className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    {gig.budget}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(gig.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* RIGHT: Bids */}
            <section className="col-span-6 md:col-span-3 hidden md:flex flex-col gap-3 p-3">

                {!selectedGig && (
                    <div className="p-6 text-center text-base-content/60">
                        Select a gig to view bids
                    </div>
                )}

                {selectedGig && (
                    <>
                        <h4 className="font-bold text-lg">
                            Bids for "{selectedGig.title}"
                        </h4>

                        {selectedGig.status === "assigned" && (
                            <div className="alert alert-success text-sm">
                                Freelancer has been hired for this gig
                            </div>
                        )}

                        {bidsLoading && (
                            <div className="text-sm text-base-content/60">
                                Loading bids...
                            </div>
                        )}

                        {!bidsLoading && visibleBids.length === 0 && (
                            <div className="text-sm text-base-content/60">
                                No bids yet
                            </div>
                        )}

                        {visibleBids.map((bid) => (
                            <div
                                key={bid._id}
                                className={`card bg-base-100 shadow-sm
                                    ${bid.status === "hired" ? "ring-2 ring-success" : ""}
                                `}
                            >
                                <div className="card-body p-4 space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1 font-semibold">
                                            <User className="w-4 h-4" />
                                            {bid.freelancerId?.name}
                                        </span>

                                        <span
                                            className={`badge ${bid.status === "hired"
                                                ? "badge-success"
                                                : "badge-outline"
                                                }`}
                                        >
                                            {bid.status}
                                        </span>
                                    </div>

                                    <p className="text-base-content/70 line-clamp-2">
                                        {bid.message}
                                    </p>

                                    <div className="flex justify-between items-center text-xs text-base-content/60">
                                        <span>${bid.price}</span>
                                        <span>{formatDate(bid.createdAt)}</span>
                                    </div>

                                    {selectedGig.status === "open" && (
                                        <div className="flex justify-end pt-2">
                                            <button
                                                className="btn btn-primary btn-sm gap-1"
                                                onClick={() => hireBid({
                                                    gigId: selectedGig._id,
                                                    freelancerId: bid?.freelancerId?._id,
                                                })}
                                                disabled={hiring}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {hiring ? "Hiring..." : "Hire"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </section>
        </div>
    );
}
