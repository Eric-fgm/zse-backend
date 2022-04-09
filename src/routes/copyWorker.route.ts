import express from "express";
import copyWorkerController from "../controllers/copyWorker.controller";

const router = express.Router();

router.get("/", copyWorkerController.get);
router.post("/pin", copyWorkerController.pin);
router.delete("/:ids", copyWorkerController.remove);

export default router;
