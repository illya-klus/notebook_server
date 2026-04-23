import { AuthRequest } from "@/src/midlewares/auth.middleware";
import { Response } from "express";
import {
  createFile,
  deleteFileById,
  getFileInfo,
  getFilesByUser,
  updateFileById,
} from "./files.serice";


export const getAllFilesWithoutContent = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const files = await getFilesByUser(userId);

    return res.status(200).json(files);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot get files" });
  }
};


export const getOneFileWithContent = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const file = await getFileInfo(Number(id));

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json(file);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot get file" });
  }
};


export const createNewFile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { title, content, folderId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const file = await createFile({
      title,
      content,
      userId,
      folderId,
    });

    return res.status(201).json(file);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot create file" });
  }
};

export const updateFile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, content } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const updated = await updateFileById(Number(id), userId, {
      title,
      content,
    });

    if (!updated) {
      return res.status(404).json({ message: "File not found or forbidden" });
    }

    return res.status(200).json(updated);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot update file" });
  }
};


export const deleteFile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const deleted = await deleteFileById(Number(id), userId);

    if (!deleted) {
      return res.status(404).json({ message: "File not found or forbidden" });
    }

    return res.status(200).json({ message: "File deleted" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot delete file" });
  }
};