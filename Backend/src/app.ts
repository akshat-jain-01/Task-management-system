import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import taskRoutes from "./routes/task.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import { connectRedis } from "./config/redis";
// import { protect, AuthRequest } from "./middlewares/auth.middleware";   

const app = express();
connectRedis();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// app.get("/api/protected", protect, (req: AuthRequest, res) => {
//     res.json({
//          message: `Hello ${req.user?.id}, you have accessed a protected route!` 
//         });
// });

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;