import { RequestHandler } from "express";
import copyWorkerService from "../services/copyWorker.service";
import filesService from "../services/files.service";

const get: RequestHandler = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query)
      return res.json({
        files: [],
        copyWorker: [],
      });
    if (query && typeof query !== "string")
      return res.status(400).json("Invalid query");
    const files = await filesService.search(query);
    const copyWorker = await copyWorkerService.search(query);
    return res.json({
      files,
      copyWorker,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messages: "Server error",
    });
  }
};

export default {
  get,
};
