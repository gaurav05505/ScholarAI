import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const apiKey = process.env.NVIDIA_API_KEY?.trim();

if (!apiKey) {
  throw new Error("NVIDIA_API_KEY is missing from the environment.");
}

const nvidia = axios.create({
  baseURL: "https://integrate.api.nvidia.com/v1",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
});

export default nvidia;