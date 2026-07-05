import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../src/models/Project.model.js';
import LearnSchema from '../src/models/Learn.Schema.js';
import Roadmap from '../src/models/Roadmap.mode.js';
import UserModel from '../src/models/user.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/docai";

async function runTests() {
    try {
        console.log("Connecting to database at:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");

        // Clear existing mock data first
        await UserModel.deleteMany({ email: "scolar.learner@scolarai.com" });
        
        // 1. Create a mock user
        const mockUser = await UserModel.create({
            name: "Scolar Learner",
            email: "scolar.learner@scolarai.com",
            password: "testpassword123"
        });
        console.log("Created mock user ID:", mockUser._id);

        // 2. Create a mock roadmap
        const mockRoadmap = await Roadmap.create({
            userId: mockUser._id,
            title: "Data Structures & Algorithms in C++",
            topic: "DSA C++",
            description: "Detailed roadmap for learning DSA with C++ from absolute basics.",
            phases: [
                {
                    name: "Basics of C++",
                    description: "Syntax, loops, conditionals, pointers",
                    modules: [
                        {
                            name: "C++ Syntax",
                            description: "Variables and types",
                            topics: [{ name: "Variables", completed: false }, { name: "Pointers", completed: false }]
                        }
                    ]
                }
            ]
        });
        console.log("Created mock roadmap ID:", mockRoadmap._id);

        // 3. Create a mock session
        const mockSession = await LearnSchema.create({
            userId: mockUser._id,
            topic: "DSA C++",
            roadmapId: mockRoadmap._id,
            status: "completed"
        });
        console.log("Created mock session ID:", mockSession._id);

        // 4. Create Project
        console.log("--- Creating Project ---");
        const mockProject = await Project.create({
            user: mockUser._id,
            topic: mockRoadmap.topic,
            title: mockRoadmap.title,
            description: mockRoadmap.description,
            roadmapId: mockRoadmap._id,
            sessionId: mockSession._id,
            chats: []
        });
        console.log("Project created successfully:", mockProject.title);

        // 5. Test saveProjectChat
        console.log("--- Testing saveProjectChat ---");
        const testChat = {
            id: "chat-1",
            title: "Lesson: C++ Syntax",
            messages: [
                { id: "msg-1", role: "user", text: "Explain C++ variables" },
                { id: "msg-2", role: "ai", text: "C++ has static typing..." }
            ]
        };

        const project = await Project.findById(mockProject._id);
        project.chats.push(testChat);
        await project.save();
        console.log("Chat saved successfully in database!");

        // Retrieve project and verify chat
        const retrievedProject = await Project.findById(mockProject._id);
        console.log("Number of chats in project:", retrievedProject.chats.length);
        console.log("First chat title:", retrievedProject.chats[0].title);
        console.log("First chat message count:", retrievedProject.chats[0].messages.length);

        if (retrievedProject.chats[0].title === "Lesson: C++ Syntax" && retrievedProject.chats[0].messages.length === 2) {
            console.log("✅ Verification successful! DB Operations match requirements.");
        } else {
            console.log("❌ Verification failed. Chat object does not match.");
        }

        // Cleanup
        console.log("--- Cleaning up ---");
        await Project.deleteMany({ user: mockUser._id });
        await LearnSchema.deleteMany({ userId: mockUser._id });
        await Roadmap.findByIdAndDelete(mockRoadmap._id);
        await UserModel.findByIdAndDelete(mockUser._id);
        console.log("Database mock items cleaned up successfully.");

    } catch (err) {
        console.error("Test execution failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database");
    }
}

runTests();
