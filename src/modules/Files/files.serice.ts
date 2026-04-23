import { prisma } from "@/src/lib/prisma";


export const getFilesByUser = async (userId: number) => {
  return prisma.note.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      userId: true,
      folderId: true,
      createdAt: true,
      updatedAt: true,
      version: true,
    },
  });
};


export const getFileInfo = async (id: number) => {
  return prisma.note.findUnique({
    where: { id },
  });
};


export const createFile = async (data: {
  title: string;
  content: string;
  userId: number;
  folderId?: number;
}) => {
  return prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.userId,
      folderId: data.folderId,
    },
  });
};


export const updateFileById = async (
  id: number,
  userId: number,
  data: {
    title?: string;
    content?: string;
  }
) => {
  const file = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!file) return null;

  return prisma.note.update({
    where: { id },
    data: {
      ...data,
      version: { increment: 1 },
    },
  });
};


export const deleteFileById = async (id: number, userId: number) => {
  const file = await prisma.note.findFirst({
    where: { id, userId },
  });

  if (!file) return null;

  await prisma.note.delete({
    where: { id },
  });

  return true;
};