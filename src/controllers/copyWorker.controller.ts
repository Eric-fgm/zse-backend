import { RequestHandler } from "express";
import copyWorkerService from "../services/copyWorker.service";

const get: RequestHandler = async (req, res, next) => {
  try {
    const page = typeof req.query.page === "string" ? +req.query.page : 1;
    const pinned = typeof req.query.pinned === "string" ? true : false;
    res.json(await copyWorkerService.getMultiple({ page, pinned }));
  } catch (err) {
    console.error(
      `Error while getting programming languages`,
      (err as Error).message
    );
    next(err);
  }
};

const create: RequestHandler = async (req, res, next) => {
  try {
    res.json(await copyWorkerService.create(req.body));
  } catch (err) {
    console.error(
      `Error while creating programming language`,
      (err as Error).message
    );
    next(err);
  }
};

const pin: RequestHandler = async (req, res) => {
  try {
    const ids = req.body.ids;
    const output: { [key: string]: boolean } = {};
    if (!ids || (ids && typeof ids.toString() !== "string"))
      return res.status(400).json("Invalid ids");
    const parsedIds = ids.split(",") as string[];
    if (parsedIds.length > 50) return res.status(400).json("Max 50");
    await copyWorkerService.pin(parsedIds);
    const result = await copyWorkerService.get(parsedIds, ["id", "pinned"]);
    for (let i = 0; i < result.length; i++) {
      const { id, pinned } = result[i];
      output[id] = pinned === "1";
    }
    return res.json(output);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const remove: RequestHandler = async (req, res, next) => {
  try {
    const ids = req.params.ids.split(",");
    await copyWorkerService.remove(ids);
    res.json(ids);
  } catch (err) {
    console.error(
      `Error while deleting programming language`,
      (err as Error).message
    );
    next(err);
  }
};

export default {
  get,
  pin,
  create,
  remove,
};
