import { Request, Response } from "express";

import { createloginUserSchema } from "../../validation/login.valid.js";
import { createRegisterUserSchema } from "../../validation/register.valid.js";
import { createUser, findUserByEmail, findUserById, generateAccessToken, generateRefreshToken, isValidPassword, RefreshTokenPayload, TokenPayload, verifyRefreshJWT } from "./auth.service.js";



export const login = async (req: Request, res: Response) => {
    try {
        const data = createloginUserSchema.safeParse(req.body);

        if(!data.success) return res.status(400).json(data.error.format())
        const { email, password } = data.data;

        const user = await findUserByEmail(email);

        if (!user || !(await isValidPassword(password, user.password))) {
          return res.status(400).json({message : "Invalid credentials."});
        }

        const payload: TokenPayload = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        const token = generateAccessToken(payload);
        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
        });

        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })
          .status(200)
          .json({
            accessToken: token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
    } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({message : "Internal server error"});
  }
}

export const register = async (req: Request, res: Response) => {
    const data = createRegisterUserSchema.safeParse(req.body);
    if(!data.success) return res.status(400).json(data.error.format());
    const user = data.data;
    
    const isUserExists = await findUserByEmail(user.email);
    if(isUserExists) return res.status(409).json({message : "User already exists."});

    const newUser = await createUser(user);

    if(!newUser) return res.status(500).json({message : "Server error. Cannot create user."});

    return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email : newUser.email,
        role : newUser.role,
    });
}

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({message : "No refresh token"});

    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) return res.status(500).json({message : "Server error"});

    const decoded = verifyRefreshJWT(token, secret);
    if(!decoded) return res.status(401).json({message : "Invalid refresh token"});

    const user = await findUserById((decoded as RefreshTokenPayload).id);
    if(!user) return res.status(401).json({message : "User not found"});

    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);

    return res.status(200).json({
        accessToken: newAccessToken,
    });
}