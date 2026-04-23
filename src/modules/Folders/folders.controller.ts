import { Request, Response } from "express";
import {
  getFoldersByUser,
  getFolderById,
  createFolderService,
  updateFolderById,
  deleteFolderById,
} from "./folders.service";
import { AuthRequest } from "@/src/midlewares/auth.middleware";


export const getAllFolders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const folders = await getFoldersByUser(userId);
    return res.status(200).json(folders);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot get folders" });
  }
};


export const getOneFolder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const folder = await getFolderById(Number(id), userId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot get folder" });
  }
};


export const createFolder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, parentId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const folder = await createFolderService({
      name,
      userId,
      parentId,
    });

    return res.status(201).json(folder);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot create folder" });
  }
};


export const updateFolder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { name, parentId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const updated = await updateFolderById(Number(id), userId, {
      name,
      parentId,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Folder not found or forbidden" });
    }

    return res.status(200).json(updated);
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: e.message || "Cannot update folder" });
  }
};


export const deleteFolder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "User undefined" });
  }

  try {
    const deleted = await deleteFolderById(Number(id), userId);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Folder not found or forbidden" });
    }

    return res.status(200).json({ message: "Folder deleted" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot delete folder" });
  }
};