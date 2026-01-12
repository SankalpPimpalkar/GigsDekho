import mongoose from "mongoose";
import { Gig } from "../models/gig.model.js";

const MONGO_URI = "";

const OWNER_ID = "";

const gigTemplates = [
    {
        title: "Build a MERN Stack Web Application",
        description: "Need a full-stack developer to build a scalable MERN application with authentication and dashboards.",
        budget: 1200,
    },
    {
        title: "Design a Modern Landing Page",
        description: "Looking for a UI/UX designer to create a responsive landing page using Figma and Tailwind.",
        budget: 450,
    },
    {
        title: "REST API Development with Node.js",
        description: "Develop secure REST APIs using Node.js, Express, and MongoDB.",
        budget: 800,
    },
    {
        title: "Fix Performance Issues in React App",
        description: "Optimize an existing React application and improve load times.",
        budget: 300,
    },
    {
        title: "Create MongoDB Data Models",
        description: "Design efficient MongoDB schemas for a freelancing platform.",
        budget: 600,
    },
    {
        title: "Implement Authentication System",
        description: "Add JWT-based authentication with role-based access control.",
        budget: 700,
    },
    {
        title: "Build Admin Dashboard",
        description: "Create an admin dashboard with charts and analytics.",
        budget: 900,
    },
    {
        title: "Convert Figma Design to React",
        description: "Convert provided Figma designs into reusable React components.",
        budget: 500,
    },
    {
        title: "Setup CI/CD Pipeline",
        description: "Setup CI/CD pipeline using GitHub Actions and Docker.",
        budget: 650,
    },
    {
        title: "Add Payment Gateway",
        description: "Integrate Stripe payment gateway into existing application.",
        budget: 750,
    },
];

const generateGigs = () => {
    return Array.from({ length: 20 }).map((_, index) => {
        const template = gigTemplates[index % gigTemplates.length];

        return {
            title: template.title,
            description: template.description,
            budget: template.budget + (index * 25),
            owner: OWNER_ID,
            status: index % 3 === 0 ? "assigned" : "open",
        };
    });
};

const seedGigs = async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'gigsdekho' });
        console.log("✅ MongoDB connected");

        await Gig.deleteMany();
        console.log("🧹 Existing gigs cleared");

        const gigs = generateGigs();
        await Gig.insertMany(gigs);

        console.log(`🌱 Successfully seeded ${gigs.length} gigs`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedGigs();
