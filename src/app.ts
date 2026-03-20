import express from "express";
import authRoutes from "./modules/auth/routes/auth.routes";

const app = express();

app.use(express.json());

/**
 * Mount auth routes
 */
app.use("/auth", authRoutes);

export default app;