import express from "express";
import uploadsController from "../controllers/uploads.controller";

const router = express.Router();

router.get("/:id", uploadsController.get);

export default router;
