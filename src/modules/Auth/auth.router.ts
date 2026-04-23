import {Router} from "express"
import { login, refresh, register } from "./auth.controller";


export const AuthRouter = Router();

AuthRouter.post("/login", login);

AuthRouter.post("/register", register);

AuthRouter.post("/refresh", refresh);
