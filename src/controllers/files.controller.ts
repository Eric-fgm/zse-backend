import { RequestHandler } from "express";
import Busboy from "busboy";
import { v4 as uuid } from "uuid";
import fs from "fs";
import filesService from "../services/files.service";
import helpers from "../utils/helper.util";

const get: RequestHandler = async (req, res, next) => {
  try {
    const page = typeof req.query.page === "string" ? +req.query.page : 1;
    const pinned = typeof req.query.pinned === "string" ? true : false;
    res.json(await filesService.getMultiple({ page, pinned }));
  } catch (err) {
    console.error(
      `Error while getting programming languages`,
      (err as Error).message
    );
    next(err);
  }
};

const upload: RequestHandler = async (req, res) => {
  const contentRange = req.headers["content-range"];
  const fileId = req.headers["x-file-id"];
  const uniqueId = req.headers["x-unique-id"];

  if (!contentRange) {
    console.log("Missing Content-Range");
    return res.status(400).json({ message: 'Missing "Content-Range" header' });
  }

  if (typeof uniqueId !== "string") {
    console.log("Missing Unique Id");
    return res.status(400).json({ message: 'Missing "X-Unique-Id" header' });
  }

  if (typeof fileId !== "string") {
    console.log("Missing File Id");
    return res.status(400).json({ message: 'Missing "X-File-Id" header' });
  }

  const match = contentRange.match(/bytes=(\d+)-(\d+)\/(\d+)/);

  if (!match) {
    console.log("Invalid Content-Range Format");
    return res.status(400).json({ message: 'Invalid "Content-Range" Format' });
  }

  const rangeStart = Number(match[1]);
  const rangeEnd = Number(match[2]);
  const fileSize = Number(match[3]);

  if (rangeStart >= fileSize) {
    await filesService.update(fileId, { size: fileSize });
    return res.status(200).json({ hasEnded: true });
  }

  if (rangeStart >= rangeEnd || rangeEnd > fileSize) {
    return res
      .status(400)
      .json({ message: 'Invalid "Content-Range" provided' });
  }

  const busboy = Busboy({
    headers: req.headers,
    limits: { files: 1, fileSize: 1024 * 1024 },
  });

  let filePath = "";

  busboy.on("file", (_, file, fileName) => {
    filePath = helpers.getFilePath(fileName.filename, uniqueId);

    helpers
      .getFileDetails(filePath)
      .then((stats) => {
        if (stats.size !== rangeStart) {
          return res.status(400).json({ message: 'Bad "chunk" provided' });
        }

        file
          .pipe(fs.createWriteStream(filePath, { flags: "a" }))
          .on("finish", () => {
            helpers.getFileDetails(filePath).then((stats) => {
              res.status(200).json({ byteRangeStart: stats.size });
            });
          })
          .on("error", (e) => {
            console.error("failed upload", e);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.log("No File Match", err);
        res.status(400).json({
          message: "No file with such credentials",
          credentials: req.query,
        });
      });
  });

  busboy.on("error", (e) => {
    console.error("failed upload", e);
    res.sendStatus(500);
  });

  req.pipe(busboy);
};

const uploadRequest: RequestHandler = async (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.size ||
      typeof req.body.type !== "string"
    ) {
      res.status(400).json({ message: 'Missing "fields"' });
    } else {
      const uniqueId = uuid();
      const { name, type } = req.body;
      const filePath = helpers.getFilePath(name, uniqueId);
      fs.createWriteStream(filePath, {
        flags: "w",
      });

      const createdFile = await filesService.create({
        name,
        size: 0,
        type,
        pinned: "0",
        path: filePath,
      });

      if (!createdFile) return res.status(500).json({ message: "Error" });

      return res.status(200).json({
        uniqueId,
        fileId: createdFile.id,
        ...createdFile,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error :/",
    });
  }
};

const uploadStatus: RequestHandler = (req, res) => {
  if (
    req.query &&
    typeof req.query.fileName === "string" &&
    typeof req.query.fileId === "string"
  ) {
    helpers
      .getFileDetails(helpers.getFilePath(req.query.fileName, req.query.fileId))
      .then((stats) => {
        res.status(200).json({ totalChunkUploaded: stats.size });
      })
      .catch((err) => {
        console.error("failed to read file", err);
        res.status(400).json({
          message: "No file with such credentials",
          credentials: req.query,
        });
      });
  }
};

const pin: RequestHandler = async (req, res) => {
  try {
    const id = req.body.id;
    if (id && typeof id.toString() !== "string")
      return res.status(400).json("Invalid id");
    await filesService.pin(id);
    const result = await filesService.get([id], ["id", "pinned"]);
    if (!result[0]) return res.status(404).json("Not found that file");
    return res.json({
      [result[0].id]: result[0].pinned === "1",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const remove: RequestHandler = async (req, res) => {
  try {
    const ids = req.params.ids.split(",");
    if (ids.length > 50) return res.status(400).json("Max 50 files");
    const paths = await filesService.getNameWithPaths(ids);
    paths.forEach(({ path }) => {
      fs.existsSync(path) && fs.unlinkSync(path);
    });
    return res.json(await filesService.remove(ids));
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default {
  get,
  upload,
  uploadStatus,
  uploadRequest,
  pin,
  remove,
};
