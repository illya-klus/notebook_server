import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";


export type TokenPayload = {
  id: number;
  email: string;
  role: string;
};

export type RefreshTokenPayload = {
  id: number;
  email: string;
};

type userRequest = {
    name: string;
    email : string;
    password : string;
}


export const findUserByEmail = async (email : string) => {
    const findingResult = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
    return findingResult;
}

export const findUserById = async (id : number) => {
    const findingResult = await prisma.user.findUnique({
        where: {
            id: id,
        }
    });
    return findingResult;
}

export const isValidPassword = async (userPassword: string, passwordHash: string) => {
    return await bcrypt.compare(userPassword, passwordHash);
}

export const createUser = async (user : userRequest) => {
    const hash = Number(process.env.SALT) || 10;

    const passwordHash = await bcrypt.hash(user.password, hash);
    const newUser = await prisma.user.create({
    data: {
        email : user.email,
        name : user.name,
        password : passwordHash
    }});

    return newUser;
}

export const generateAccessToken = (payload : TokenPayload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(payload, secret, { expiresIn: "1m" });
}

export const generateRefreshToken = (payload : RefreshTokenPayload) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export const verifyRefreshJWT = (token: string, secret: string) =>  {
    return jwt.verify(token, secret);
}