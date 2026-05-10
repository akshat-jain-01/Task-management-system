import prisma from "../config/db";

export const createTask = async (userId: number, title: string, description: string) => {

  const task =  await prisma.task.create({
    data: { userId, title, description },

  })

  console.log("Task created:", task);
  
  return task
}


export const getTaskService = async (userId: number) => {

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return tasks

}


export const getAllTasksService = async () => {

  const tasks = await prisma.task.findMany({
    include:{
      user: true,
    }
  })
  return tasks;
}


export const updateTaskService = async (taskId: number, userId: number, title: string, description: string, completed: boolean) => {

  const existingTask = await prisma.task.findUnique({

    where: { id: taskId },

  });

  if(!existingTask) {

    throw new Error("Task not found");

  }

  if(existingTask?.userId !== userId){

    throw new Error("Unauthorized");

  }

  const updatedTask = await prisma.task.update({

    where: { id: taskId },
    data: { title, description, completed },

  })

  return updatedTask

}


export const deleteTaskService = async (taskId: number, userId: number) => {

  const existingTask = await prisma.task.findUnique({

    where: { id: taskId },

  });

  if(!existingTask) {

    throw new Error("Task not found");

  }

  if(existingTask?.userId !== userId) {

    throw new Error("Unauthorized");

  }

  const deletedTask = await prisma.task.delete({

    where: { id: taskId },

  });

  return deletedTask;

}