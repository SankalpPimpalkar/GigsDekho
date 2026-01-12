import { DollarSign, User, Clock, MessageSquare, BadgeCheck, XCircle } from "lucide-react";
import { formatDate } from "./GigCard";

export default function AppliedGigCard({ gig }) {
    const {
        title,
        description,
        budget,
        owner,
        createdAt,
        myBid
    } = gig;

    const statusColor = {
        pending: "badge-warning",
        hired: "badge-success",
        rejected: "badge-error"
    };

    return (
        <div className="card rounded-md bg-base-100 shadow-sm">
            <div className="card-body p-5 space-y-1">

                {/* Title */}
                <h2 className="text-xl font-extrabold line-clamp-1">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-sm text-base-content/70 line-clamp-2">
                    {description}
                </p>
                <p className="text-sm text-base-content/70 line-clamp-2">
                    ${budget}
                </p>

                {/* Gig Meta */}
                <div className="flex items-center justify-between text-sm text-base-content/60">
                    <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {owner?.name || "Unknown"}
                    </span>

                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(createdAt)}
                    </span>
                </div>

                <div className="divider my-1" />

                {/* Bid Info */}
                <div className="space-y-2 text-sm">

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold">
                            <DollarSign className="w-4 h-4" />
                            Your Bid: ${myBid.price}
                        </span>

                        <span className={`badge text-xs ${statusColor[myBid.status]}`}>
                            {myBid.status.toLowerCase()}
                        </span>
                    </div>

                    <div className="flex items-start gap-2 text-base-content/70">
                        <MessageSquare className="w-4 h-4 mt-0.5" />
                        <p className="line-clamp-2">
                            {myBid.message}
                        </p>
                    </div>

                    <p className="text-xs text-base-content/50">
                        Applied {formatDate(myBid.createdAt)}
                    </p>

                </div>
            </div>
        </div>
    );
}
