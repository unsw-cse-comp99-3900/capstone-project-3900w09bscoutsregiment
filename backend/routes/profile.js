import dotenv from "dotenv";
dotenv.config();
import express from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET_KEY =
    "a64574ab370ef9fb3f5d5b21ed91f092a8f51713b84f34be67641d14e2b9c83f18860d21caf5dcfed5e04d216cbef38f07c75d3de60098b7af42351d21c7f408";

const profileRouter = express.Router();

export const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: "Failed to authenticate token" });
        }

        // set userId so thats its in the request object
        req.userId = decoded.id;
        next();
    });
};

// Get username, email
profileRouter.get("/details", authMiddleware, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(400).json({ message: "This user does not exist" });
    }
    try {
        return res.status(200).json({ email: user.email, name: user.name });
    } catch {
        return res
            .status(500)
            .json({ message: "Error retrieving user profile" });
    }
});

// Update email
profileRouter.put("/update/email", authMiddleware, async (req, res) => {
    const { oldEmail, newEmail } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (oldEmail !== user.email) {
            return res.status(400).json({ message: "Incorrect current email" });
        }

        await User.findByIdAndUpdate(req.userId, { $set: { email: newEmail } });

        return res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Error occured while updating email` });
    }
});

// Update password
profileRouter.put("/update/resetpassword", authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res
                .status(400)
                .json({ message: "This user does not exist" });
        }

        const isOldPasswordCorrect = await user.matchPassword(oldPassword);

        if (!isOldPasswordCorrect) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(req.userId, {
            $set: { password: hashedPassword },
        });

        return res
            .status(200)
            .json({ message: "Password updated successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error occured while updating passwords" });
    }
});

export default profileRouter;
