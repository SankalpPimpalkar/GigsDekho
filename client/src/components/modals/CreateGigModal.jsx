import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, FileText, Banknote } from "lucide-react";
import { gigsAPI } from "../../api/axios";

export default function CreateGigModal() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [formError, setFormError] = useState("");

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            gigsAPI.create({
                title,
                description,
                budget: Number(budget),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(["gigs"]);
            queryClient.invalidateQueries(["gigs-applications"]);

            setTitle("");
            setDescription("");
            setBudget("");
            setFormError("");

            document.getElementById("create_gig_modal")?.close();
        },
        onError: (error) => {
            setFormError(error.message || "Failed to create gig");
        },
    });

    const handleSubmit = () => {
        if (!title.trim()) {
            return setFormError("Title is required");
        }

        if (!description.trim()) {
            return setFormError("Description is required");
        }

        if (!budget || Number(budget) <= 0) {
            return setFormError("Please enter a valid budget");
        }

        setFormError("");
        mutate();
    };

    return (
        <dialog id="create_gig_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box w-full max-w-xl space-y-5">

                {/* Header */}
                <section className="space-y-1">
                    <h3 className="text-xl font-extrabold">
                        Create a New Gig
                    </h3>
                    <p className="text-sm text-secondary">
                        Post a gig and start receiving proposals
                    </p>
                </section>

                {/* Form */}
                <section className="space-y-3">

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Title
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full text-sm"
                            placeholder="e.g. Build a MERN Stack App"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Description
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full text-sm"
                            rows={4}
                            placeholder="Describe the work, requirements, and expectations..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    {/* Budget */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Banknote className="w-4 h-4" />
                            Budget ($)
                        </label>
                        <input
                            type="number"
                            className="input input-bordered w-full text-sm"
                            placeholder="Enter budget"
                            min={0}
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    {formError && (
                        <p className="text-error text-sm">{formError}</p>
                    )}
                </section>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <form method="dialog">
                        <button
                            className="btn btn-ghost btn-sm"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                    </form>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create Gig"}
                    </button>
                </div>

            </div>
        </dialog>
    );
}
