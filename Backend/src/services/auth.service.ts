import prisma from "../config/db";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const regiserUser = async (name: string, email: string, password: string) => {

    const existingUser = await prisma.user.findUnique({ where: { email } });


    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });
    
    const token = generateToken(user.id.toString(), user.role);

    return {
        message: "User registered successfully",
        token,
        user,
    }
}

export const loginUser = async (email: string, password: string) => {

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error("Invalid credentials");
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id.toString(), user.role);

    return {
        message: "User logged in successfully",
        token,
        user,
    }
}
