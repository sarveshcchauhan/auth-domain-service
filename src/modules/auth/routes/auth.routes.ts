import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { loginRateLimiter } from "../../../middleware/rateLimiter.middleware";
import { AuthController } from "../../../http/controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", loginRateLimiter, controller.login);
router.post("/refresh", controller.refreshToken);

// protected route
router.delete("/user/:id", authMiddleware, controller.deleteUser);

export default router;