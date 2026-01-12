import { DollarSign, User, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import GigDetailsModal from "../modals/GigDetailsModal";

export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return "Yesterday";

    return `${diffDays} days ago`;
}

export default function GigCard({ gig, onClick, onHire }) {
    const { title, description, budget, owner, createdAt } = gig;

    return (
        <div
            onClick={() => document.getElementById(gig._id).showModal()}
            role="button"
            tabIndex={0}
            className="
                card rounded-md bg-base-100 shadow-sm
                transition cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-base-300
            "
            onKeyDown={(e) => e.key === "Enter" && onClick?.(gig)}
        >
            <div className="card-body p-5 space-y-1">

                {/* Title */}
                <h2 className="text-xl font-extrabold leading-snug line-clamp-1">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-sm text-base-content/70 line-clamp-2">
                    {description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">

                    {/* Budget */}
                    <div className="flex items-center gap-1 font-bold">
                        <span className="text-lg">${budget}</span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-base-content/60">
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {owner?.name || "Unknown"}
                        </span>

                        <span className="flex items-center gap-1 text-xs">
                            <Clock className="w-4 h-4" />
                            {formatDate(createdAt)}
                        </span>
                    </div>
                </div>

                {/* Optional Hire Action */}
                {onHire && (
                    <div className="flex justify-end pt-2">
                        <button
                            className="btn btn-primary btn-sm gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onHire(gig);
                            }}
                        >
                            <CheckCircle className="w-4 h-4" />
                            Hire
                        </button>
                    </div>
                )}

            </div>
            <GigDetailsModal gigId={gig._id} gig={gig} />
        </div>
    );
}
