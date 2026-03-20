import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { loginRateLimiter } from "../../../middleware/rateLimiter.middleware";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", loginRateLimiter, controller.login);
router.post("/refresh", controller.refreshToken);

// protected route
router.delete("/user/:id", authMiddleware, controller.deleteUser);

export default router;