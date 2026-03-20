import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {

  private service = new AuthService();

  /**
   * Register new user
   */
  register = async (req: Request, res: Response) => {
    try {

      const user = await this.service.register(req.body);

      res.status(201).json({
        message: "User registered",
        user
      });

    } catch (err: any) {

      res.status(400).json({
        message: err.message
      });

    }
  };

  /**
   * Login endpoint
   */
  login = async (req: Request, res: Response) => {

    try {

      const { email, password } = req.body;

      const token = await this.service.login(email, password);

      res.json({ token });

    } catch (err: any) {

      res.status(401).json({
        message: err.message
      });

    }

  };

  /**
   * Delete user
   */
  deleteUser = async (req: Request, res: Response) => {

    const { id } = req.params;

    await this.service.deleteUser(String(id));

    res.json({
      message: "User deleted"
    });

  };

  /**
   * Refresh token endpoint
   */
  refreshToken = async (req: Request, res: Response) => {
    try {
      const { userId, refreshToken } = req.body;

      const tokens = await this.service.refreshToken(userId, refreshToken);

      res.json(tokens);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

}