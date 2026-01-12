import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export default async function authenticate(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = {
            userId: user._id,
            email: user.email,
            name: user.name
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired. Please login again."
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
    }
}