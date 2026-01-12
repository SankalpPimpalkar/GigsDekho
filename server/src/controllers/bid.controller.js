import { Gig } from "../models/gig.model.js";
import { Bid } from "../models/bid.model.js";

export async function createBid(req, res) {
    try {
        const { message, price } = req.body;
        const { gigId } = req.params;
        const freelancerId = req.user.userId;

        if (!gigId || !message || !price) {
            return res.status(400).json({
                message: "Gig ID, message and price are required"
            });
        }

        if (price < 0) {
            return res.status(400).json({
                message: "Price must be a positive number"
            });
        }

        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({
                message: "Gig not found"
            });
        }

        if (gig.owner.toString() === freelancerId.toString()) {
            return res.status(401).json({
                message: "You cannot create bid in your own gig"
            })
        }

        if (gig.status !== 'open') {
            return res.status(400).json({
                message: "Cannot bid on a gig that is not open"
            });
        }

        const existingBid = await Bid.findOne({ gigId, freelancerId });
        if (existingBid) {
            return res.status(400).json({
                message: "You have already placed a bid on this gig"
            });
        }

        const newBid = await Bid.create({
            gigId,
            freelancerId,
            message,
            price,
        });

        return res.status(201).json({
            message: "Bid created successfully",
            bid: newBid
        });

    } catch (error) {
        console.error("Create bid error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function fetchBids(req, res) {
    try {
        const { gigId } = req.params;
        const userId = req.user.userId;

        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({
                message: "Gig not found"
            });
        }

        if (gig.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Only owner of the gig is authorized for this action"
            });
        }

        const bidFilter = { gigId };

        if (gig.status === "assigned") {
            bidFilter.status = "hired";
        }

        const bids = await Bid.find(bidFilter)
            .populate("freelancerId", "name email bio")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: `Found ${bids.length} bids for this gig`,
            bids
        });

    } catch (error) {
        console.error("Fetch bids error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}