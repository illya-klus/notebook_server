import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"

type TokenPayload = {
  id: number;
  email: string;
  role: string;
}


export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const AuthMiddleware = async (req : AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({message: "Unauthorized"});

    const secret = process.env.JWT_SECRET;
    if(!secret) return res.status(500).json({message: "Auth server error."});

    const token = header.split(" ")[1];

    try{
        req.user = verifyToken(token, secret);
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }

}

const verifyToken = (token: string, secret: string): TokenPayload => {
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  return decoded as TokenPayload;
};