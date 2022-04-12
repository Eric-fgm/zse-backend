import fs from "fs";
import { promisify } from "util";

const paginationMeta = (currentPage = 1, itemsPerPage: number) => {
  if (currentPage < 1) currentPage = 1;
  if (itemsPerPage > 50) itemsPerPage = 50;
  return {
    page: currentPage,
    offset: (currentPage - 1) * itemsPerPage,
  };
};

const emptyOrRows = <T>(rows?: T) => {
  if (!rows) {
    return [];
  }
  return rows;
};

const getFilePath = (fileName: string, fileId: string) =>
  __dirname + `/../uploads/file-${fileId}-${fileName}`;

const getRootFilePath = (id: string) => `src/uploads/${id}`;

const getFileDetails = promisify(fs.stat);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  getFilePath,
  paginationMeta,
  emptyOrRows,
  getFileDetails,
  getRootFilePath,
  delay,
};
