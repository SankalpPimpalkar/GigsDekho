import { createBid, fetchBids } from "../controllers/bid.controller.js";
import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";

const bidRouter = Router()

bidRouter.post('/:gigId', authenticate, createBid)
bidRouter.get('/:gigId', authenticate, fetchBids)

export default bidRouter