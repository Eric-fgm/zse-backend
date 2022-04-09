import { RequestHandler } from "express";
import fs from "fs";
import helpers from "../utils/helper.util";

const get: RequestHandler = async (req, res) => {
  const fileId = req.params.id;
  if (typeof fileId !== "string") return res.json("?");
  const dest = helpers.getRootFilePath(fileId);

  try {
    if (fs.existsSync(dest)) {
      return res.download(dest);
    } else {
      return res.status(404).json("Not found");
    }
  } catch (err) {}

  return res.status(500).json("Error");
};

export default {
  get,
};
