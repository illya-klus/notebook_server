import { prisma } from "@/src/lib/prisma";


export const getFoldersByUser = async (userId: number) => {
  return prisma.folder.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      parentId: true,
      userId: true,
    },
  });
};


export const getFolderById = async (id: number, userId: number) => {
  return prisma.folder.findFirst({
    where: { id, userId },
    include: {
      notes: true,
    },
  });
};


export const createFolderService = async (data: {
  name: string;
  userId: number;
  parentId?: number;
}) => {

  if (data.parentId) {
    const parent = await prisma.folder.findFirst({
      where: { id: data.parentId, userId: data.userId },
    });

    if (!parent) {
      throw new Error("Parent folder not found");
    }
  }

  return prisma.folder.create({
    data: {
      name: data.name,
      userId: data.userId,
      parentId: data.parentId ?? null,
    },
  });
};


export const updateFolderById = async (
  id: number,
  userId: number,
  data: {
    name?: string;
    parentId?: number | null;
  }
) => {
  const folder = await prisma.folder.findFirst({
    where: { id, userId },
  });

  if (!folder) return null;


  if (data.parentId === id) {
    throw new Error("Folder cannot be its own parent");
  }


  if (data.parentId) {
    const parent = await prisma.folder.findFirst({
      where: { id: data.parentId, userId },
    });

    if (!parent) {
      throw new Error("Parent folder not found");
    }
  }

  return prisma.folder.update({
    where: { id },
    data: {
      name: data.name,
      parentId:
        data.parentId === undefined ? undefined : data.parentId,
    },
  });
};


export const deleteFolderById = async (id: number, userId: number) => {
  const folder = await prisma.folder.findFirst({
    where: { id, userId },
  });

  if (!folder) return null;


  await prisma.folder.updateMany({
    where: { parentId: id },
    data: { parentId: null },
  });

  await prisma.folder.delete({
    where: { id },
  });

  return true;
};