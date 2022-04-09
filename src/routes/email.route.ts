import express from "express";
import emailController from "../controllers/email.controller";

const router = express.Router();

router.post("/", emailController.send);

export default router;
