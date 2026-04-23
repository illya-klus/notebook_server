import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AuthRouter } from "./modules/Auth/auth.router";
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials:true,
}));


app.get("/", (req, res)=> res.status(200).json({message:"Hello from server!"}));
app.use("/auth", AuthRouter);

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log("Server started on port: " + Port);
});