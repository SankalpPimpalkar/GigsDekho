import { postGig, browseGigs, hireFreelancer, appliedGigs, getMyGigs } from "../controllers/gig.controller.js";
import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";

const gigRouter = Router()

gigRouter.post('/', authenticate, postGig)
gigRouter.post('/:gigId/hire/:freelancerId', authenticate, hireFreelancer)
gigRouter.get('/', browseGigs)
gigRouter.get('/applications', authenticate, appliedGigs)
gigRouter.get('/my-gigs', authenticate, getMyGigs)

export default gigRouter