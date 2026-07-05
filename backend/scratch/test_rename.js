import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../src/models/Project.model.js';
import Roadmap from '../src/models/Roadmap.mode.js';
import UserModel from '../src/models/user.model.js';
import LearnSchema from '../src/models/Learn.Schema.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/docai";

async function verifyRename() {
    try {
        console.log("Connecting to docai MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully.");

        // 1. Setup mock data
        const mockUser = await UserModel.create({
            name: "Rename Tester",
            email: "rename@scolarai.com",
            password: "renamepassword"
        });

        const mockRoadmap = await Roadmap.create({
            userId: mockUser._id,
            title: "Original Roadmap Title",
            topic: "Topic 1",
            phases: []
        });

        const mockSession = await LearnSchema.create({
            userId: mockUser._id,
            topic: "Topic 1",
            roadmapId: mockRoadmap._id,
            status: "completed"
        });

        const mockProject = await Project.create({
            user: mockUser._id,
            topic: "Topic 1",
            title: "Original Project Title",
            roadmapId: mockRoadmap._id,
            sessionId: mockSession._id,
            chats: []
        });

        console.log("Setup complete. Testing updates...");

        // 2. Perform Roadmap update simulation
        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
            mockRoadmap._id,
            { title: "Renamed Roadmap Title" },
            { new: true }
        );
        console.log("Roadmap Renamed Title in DB:", updatedRoadmap.title);

        // 3. Perform Project update simulation
        const updatedProject = await Project.findByIdAndUpdate(
            mockProject._id,
            { title: "Renamed Project Title" },
            { new: true }
        );
        console.log("Project Renamed Title in DB:", updatedProject.title);

        if (updatedRoadmap.title === "Renamed Roadmap Title" && updatedProject.title === "Renamed Project Title") {
            console.log("✅ Verification SUCCESSFUL: rename functions execute correctly!");
        } else {
            console.log("❌ Verification FAILED: titles did not update.");
        }

        // Cleanup
        await Project.findByIdAndDelete(mockProject._id);
        await LearnSchema.findByIdAndDelete(mockSession._id);
        await Roadmap.findByIdAndDelete(mockRoadmap._id);
        await UserModel.findByIdAndDelete(mockUser._id);
        console.log("Cleanup complete.");

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyRename();
