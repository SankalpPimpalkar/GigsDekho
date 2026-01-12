import { registerUser, loginUser, logoutUser, getUser, getFreelancerStats } from "../controllers/auth.controller.js";
import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.delete("/logout", authenticate, logoutUser)
authRouter.get("/me", authenticate, getUser)
authRouter.get("/stats", authenticate, getFreelancerStats)

export default authRouter