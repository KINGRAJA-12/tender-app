import express from "express"
import { getMe, login, logout, refreshAccessToken, register } from "../controllers/auth.controller.js";
import { protect } from "../middleware/middleware.js";
export const authRouters=express.Router();
authRouters.post("/register",register);
authRouters.post("/login",login);
authRouters.get("/getme",protect,getMe);
authRouters.get("/logout",protect,logout);
authRouters.get("/refresh-accessToken",refreshAccessToken);