import { Router } from "express";
import {
  getAllFilesWithoutContent,
  getOneFileWithContent,
  createNewFile,
  updateFile,
  deleteFile,
} from "./files.controller";

export const FilesRouter = Router();

FilesRouter.get("/", getAllFilesWithoutContent);
FilesRouter.get("/:id", getOneFileWithContent);

FilesRouter.post("/", createNewFile);
FilesRouter.patch("/:id", updateFile);
FilesRouter.delete("/:id", deleteFile);





