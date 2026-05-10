import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createTask, deleteTaskService, getAllTasksService, getTaskService, updateTaskService } from "../services/task.service";
import { taskSchema, UpdateTaskSchema } from "../validators/task.validator";
import redisClient from "../config/redis";

export const createTaskController = async (req: AuthRequest, res: Response) => {

  try {

    taskSchema.parse(req.body);

    const { title, description } = req.body;
    const userId = Number(req.user?.id);


    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }   

    const task = await createTask(userId, title, description);

    await redisClient.del(`tasks:${userId}`); // Invalidate cache
    console.log("Task updated and cache invalidated");

    return res.status(201).json(task);
    
  } 
  catch (error:any) {

    return res.status(400).json({ errors: error.errors ||  error.message });

  }

}


export const getTaskController = async (req: AuthRequest, res: Response) => {

  const userId = Number(req.user?.id);

  try {

    const cachedTasks = await redisClient.get(`tasks:${userId}`);
    if (cachedTasks) {

      console.log("Serving from cache");

      return res.status(200).json(JSON.parse(cachedTasks));

    }

    const tasks = await getTaskService(userId);

    await redisClient.set(
      `tasks:${userId}`, 
      JSON.stringify(tasks),
       { EX: 3600 }
      ); // Cache for 1 hour

    console.log("Serving from PostgreSQL");

    return res.status(200).json(tasks);

  } 

  catch (error:any) {
    return res.status(400).json({ errors: error.errors ||  error.message });
  }
}



export const getAllTasksController = async (req: AuthRequest, res: Response) => {

  try {
    
    const tasks = await getAllTasksService();

    return res.status(200).json(tasks);

  } catch (error:any) {

    return res.status(400).json({ errors: error.errors ||  error.message });
    
  }
}



export const updateTaskController = async (req: AuthRequest, res: Response) => {

  try {

  UpdateTaskSchema.parse(req.body);

  const {id} = req.params;
  const { title, description, completed } = req.body;
  const userId = Number(req.user?.id);  


    const updatedTask = await updateTaskService(Number(id), userId, title, description, completed);

    await redisClient.del(`tasks:${userId}`); // Invalidate cache

    console.log("Task updated and cache invalidated");

    return res.status(200).json(updatedTask);  
  } 

  catch (error:any) {
    return res.status(400).json({ errors: error.errors || error.message });
  } 
}


export const deleteTaskController = async (req: AuthRequest, res: Response) => {

  const {id} = req.params;
  const userId = Number(req.user?.id);  
  try {

    await deleteTaskService(Number(id), userId);

    await redisClient.del(`tasks:${userId}`); // Invalidate cache
    console.log("Task updated and cache invalidated");
    
    return res.status(200).json({ message: "Task deleted successfully" }); 
  } 

  catch (error:any) {
    return res.status(400).json({ errors: error.errors || error.message });
  } 

}