import { Router } from "express";
import {
  getAllFolders,
  getOneFolder,
  createFolder,
  updateFolder,
  deleteFolder,
} from "./folders.controller";

export const FoldersRouter = Router();

FoldersRouter.get("/", getAllFolders);
FoldersRouter.get("/:id", getOneFolder);

FoldersRouter.post("/", createFolder);
FoldersRouter.patch("/:id", updateFolder);
FoldersRouter.delete("/:id", deleteFolder);