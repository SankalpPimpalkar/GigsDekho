import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Bid } from "../models/bid.model.js";
import mongoose from "mongoose";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
};

export async function registerUser(req, res) {
    try {
        const { name, email, password, bio } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // I took this from ChatGPT
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            bio: bio || ""
        });

        return res.status(201).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found with this email"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const payload = {
            userId: user._id,
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}

export async function getUser(req, res) {
    try {
        return res.status(200).json({ user: req.user, message: "User details fetched" })

    } catch (error) {
        console.error("GetUser error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}


export async function getFreelancerStats(req, res) {
    try {
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const totalGigsApplied = await Bid.countDocuments({
            freelancerId: userId,
        });

        const hiredBids = await Bid.find({
            freelancerId: userId,
            status: "hired",
        });

        const totalGigsHired = hiredBids.length;

        const totalRevenue = hiredBids.reduce((sum, bid) => sum + bid.price, 0);

        return res.status(200).json({
            message: "Freelancer stats fetched successfully",
            stats: {
                totalGigsApplied,
                totalGigsHired,
                totalRevenue,
            },
        });
    } catch (error) {
        console.error("getFreelancerStats error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
}

export async function logoutUser(req, res) {
    try {
        res.clearCookie('token', COOKIE_OPTIONS);

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}