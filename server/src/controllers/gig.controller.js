import { Gig } from "../models/gig.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Bid } from "../models/bid.model.js";

export async function postGig(req, res) {
    try {
        const { title, description, budget } = req.body;
        const ownerId = req.user.userId;

        if (!title || !description || !budget) {
            return res.status(400).json({
                message: "Title, description and budget are required"
            });
        }

        if (budget < 0) {
            return res.status(400).json({
                message: "Budget must be a positive number"
            });
        }

        const newGig = await Gig.create({
            title,
            description,
            budget,
            owner: ownerId,
        });

        return res.status(201).json({
            message: "Gig created successfully",
            gig: newGig
        });

    } catch (error) {
        console.error("Post gig error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function browseGigs(req, res) {
    try {
        const { q } = req.query;

        let searchQuery = { status: 'open' };

        if (q && q.trim() !== '') {
            searchQuery.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        const gigs = await Gig.find(searchQuery).populate("owner", "name email").sort({ createdAt: -1 })

        const message = q && q.trim() !== ''
            ? `Found ${gigs.length} gigs matching "${q}"`
            : `Fetched all ${gigs.length} opened gigs`;

        return res.status(200).json({
            message: message,
            gigs: gigs
        });

    } catch (error) {
        console.error("Browse gigs error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function getMyGigs(req, res) {
    try {
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const gigs = await Gig.find({
            owner: userId
        })
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "My gigs fetched successfully",
            gigs
        });

    } catch (error) {
        console.error("getMyGigs error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function appliedGigs(req, res) {
    try {
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const bids = await Bid.find({
            freelancerId: userId
        })
            .populate({
                path: "gigId",
                populate: {
                    path: "owner",
                    select: "name email"
                }
            })
            .sort({ createdAt: -1 });

        const gigs = bids.map((bid) => ({
            _id: bid.gigId._id,
            title: bid.gigId.title,
            description: bid.gigId.description,
            budget: bid.gigId.budget,
            status: bid.gigId.status,
            createdAt: bid.gigId.createdAt,
            owner: bid.gigId.owner,
            myBid: {
                _id: bid._id,
                message: bid.message,
                price: bid.price,
                status: bid.status,
                createdAt: bid.createdAt
            }
        }));

        return res.status(200).json({
            message: "Applied gigs fetched successfully",
            gigs
        });

    } catch (error) {
        console.error("appliedGigs error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function hireFreelancer(req, res) {
    const session = await mongoose.startSession();

    try {
        const { gigId, freelancerId } = req.params;
        const userId = req.user.userId;

        if (
            !mongoose.Types.ObjectId.isValid(gigId) ||
            !mongoose.Types.ObjectId.isValid(freelancerId)
        ) {
            return res.status(400).json({
                message: "Invalid gig or freelancer ID"
            });
        }

        session.startTransaction();

        const gig = await Gig.findById(gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Gig not found"
            });
        }

        if (gig.owner.toString() !== userId.toString()) {
            await session.abortTransaction();
            return res.status(403).json({
                message: "Only the gig owner can hire a freelancer"
            });
        }

        const freelancer = await User.findById(freelancerId)
            .select("-password")
            .session(session);

        if (!freelancer) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Freelancer not found"
            });
        }

        const freelancerBid = await Bid.findOne({
            gigId,
            freelancerId
        }).session(session);

        if (!freelancerBid) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Freelancer has not placed a bid on this gig"
            });
        }

        await Bid.updateOne(
            { _id: freelancerBid._id },
            { $set: { status: "hired" } },
            { session }
        );

        await Bid.updateMany(
            {
                gigId,
                freelancerId: { $ne: freelancerId }
            },
            { $set: { status: "rejected" } },
            { session }
        );

        await Gig.updateOne(
            { _id: gigId },
            { $set: { status: "assigned" } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Freelancer hired successfully",
            freelancer
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Hire Freelancer error:", error);

        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}
