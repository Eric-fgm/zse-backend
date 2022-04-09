import express from "express";
import filesController from "../controllers/files.controller";

const router = express.Router();

router.get("/", filesController.get);
router.post("/pin", filesController.pin);
router.post("/upload", filesController.upload);
router.post("/upload-status", filesController.uploadStatus);
router.post("/upload-request", filesController.uploadRequest);
router.delete("/:ids", filesController.remove);

export default router;
