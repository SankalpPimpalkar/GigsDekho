import { Banknote, Calendar, User } from "lucide-react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../ui/GigCard";
import { bidsAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContextProvider";

export default function GigDetailsModal({ gigId = "", gig }) {
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState("");
    const [formError, setFormError] = useState("");

    const { user } = useAuth();
    const isOwner = user?.userId === gig?.owner?._id;
    console.log(user, gig?.owner?._id)

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => bidsAPI.create(gigId, { message, price: amount }),
        onSuccess: () => {
            queryClient.invalidateQueries(["gig-details", gigId]);

            setMessage("");
            setAmount("");
            setFormError("");

            document.getElementById(gigId)?.close();
        },
        onError: (error) => {
            setFormError(error.message);
        },
    });

    const handleSubmit = () => {
        if (!message.trim()) {
            return setFormError("Proposal message is required");
        }

        if (!amount || Number(amount) <= 0) {
            return setFormError("Please enter a valid proposed budget");
        }

        if (Number(amount) > gig.budget) {
            return setFormError("Proposed budget cannot exceed gig budget");
        }

        setFormError("");

        mutate({
            gigId,
            message,
            amount: Number(amount),
        });
    };

    return (
        <dialog id={gigId} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box w-full max-w-3xl space-y-5">

                {/* Gig Info */}
                <section className="space-y-1">
                    <h3 className="text-xl font-extrabold">{gig?.title}</h3>
                    <p className="flex items-center gap-2 text-sm text-secondary">
                        <User className="w-4 h-4" />
                        Posted by {gig?.owner?.name || "Unknown"}
                    </p>
                </section>

                <section className="flex flex-col gap-2 text-sm text-secondary">
                    <div className="flex items-center gap-3">
                        <Banknote className="size-5" />
                        <p>${gig?.budget}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="size-5" />
                        <p>Posted {formatDate(gig?.createdAt)}</p>
                    </div>
                </section>

                <section className="space-y-2">
                    <h5 className="font-bold text-sm">Description</h5>
                    <p className="text-sm text-secondary leading-relaxed">
                        {gig?.description}
                    </p>
                </section>

                <div className="divider my-1" />

                {/* Only show proposal inputs if not owner */}
                {!isOwner && (
                    <section className="space-y-3">
                        <h5 className="font-bold text-sm">Send Proposal</h5>

                        <textarea
                            className="textarea textarea-bordered w-full text-sm"
                            rows={4}
                            placeholder="Write a short message explaining why you're a good fit..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isPending}
                        />

                        <input
                            type="number"
                            className="input input-bordered w-full text-sm"
                            placeholder="Your proposed budget ($)"
                            min={0}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isPending}
                        />

                        {formError && (
                            <p className="text-error text-sm">{formError}</p>
                        )}
                    </section>
                )}

                {/* Cancel / Close button is always visible */}
                <div className="flex justify-end gap-2 pt-2">
                    <form method="dialog">
                        <button className="btn btn-ghost btn-sm">Cancel</button>
                    </form>

                    {/* Show send button only if not owner */}
                    {!isOwner && (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSubmit}
                            disabled={isPending}
                        >
                            {isPending ? "Sending..." : "Send Proposal"}
                        </button>
                    )}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
