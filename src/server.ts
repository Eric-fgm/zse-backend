import express from "express";
import cors from "cors";
import * as mySQL from "./services/db.service";
import email from "./routes/email.route";
import files from "./routes/files.route";
import copyWorker from "./routes/copyWorker.route";
import uploads from "./routes/uploads.route";
import search from "./routes/search.route";

const PORT = process.env.PORT || 3001;

const app = express();
mySQL.init();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/search", search);
app.use("/email", email);
app.use("/files", files);
app.use("/copy-worker", copyWorker);
app.use("/src/uploads", uploads);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
