import express from "express";
import { connectMongoDB } from "./configs/db.config.js";
import cors from "cors";
import ENV from "./configs/env.config.js";
import cookieParser from "cookie-parser";
import path from "path";
import authRouter from "./routes/auth.route.js";
import gigRouter from "./routes/gig.route.js";
import bidRouter from "./routes/bid.route.js";

const app = express()
const __dirname = path.resolve()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}))

// ROUTES
app.use("/api/auth", authRouter)
app.use("/api/gigs", gigRouter)
app.use("/api/bids", bidRouter)

if (ENV.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("/{*any}", (req, res) => {
        return res
            .sendFile(path.join(__dirname, "../client", "dist", "index.html"))
    })
}

// LISTENING
app.listen(ENV.PORT, async () => {
    await connectMongoDB()
    console.log("🔥 Server started", ENV.PORT)
})