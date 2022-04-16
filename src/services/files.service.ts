import { execute } from "../services/db.service";
import helpers from "../utils/helper.util";
import type { TFIle } from "../types";

const getMultiple = async ({ page = 1, itemsPerPage = 50, pinned = false }) => {
  const paginationMeta = helpers.paginationMeta(page, itemsPerPage);
  const rows = await execute<TFIle[]>(
    `SELECT id, type, name, size, path, IF(pinned > 0, TRUE, FALSE) AS isPinned, unix_timestamp(date_created) as dateCreated
    FROM files ${
      pinned ? "WHERE pinned = 1" : ""
    } ORDER BY date_created DESC LIMIT ?,?`,
    [paginationMeta.offset, itemsPerPage]
  );

  return {
    files: rows,
    meta: paginationMeta,
  };
};

const get = async (ids: string[], columns: string[]) => {
  const rows = await execute<any[]>(`SELECT ?? FROM files WHERE id IN (?)`, [
    columns,
    ids,
  ]);

  return rows;
};

const search = async (query: string) => {
  query = `%${query}%`;
  const rows = await execute<any[]>(
    `SELECT id, type, name, size, path, IF(pinned > 0, TRUE, FALSE) AS isPinned, unix_timestamp(date_created) as dateCreated FROM files WHERE name LIKE ? LIMIT 20`,
    [query]
  );

  return rows;
};

async function create(file: Omit<Omit<TFIle, "id">, "dateCreated">) {
  const result = await execute<boolean>(
    `INSERT INTO files 
    (name, type, size, path, pinned)
    VALUES 
    (?, ?, ?, ?, ?)`,
    [file.name, file.type, file.size, file.path, file.pinned]
  );

  let fileOutput = null;

  if (result) {
    const filesResult = await execute<TFIle[]>(
      `SELECT id, type, name, size, path, unix_timestamp(date_created) as dateCreated FROM files 
      WHERE path = ?`,
      [file.path]
    );
    fileOutput = filesResult[0] || 0;
  }

  return fileOutput;
}

async function update(id: string, columns: object) {
  const result = await execute<boolean>(`UPDATE files SET ? WHERE id = ?`, [
    columns,
    id,
  ]);

  return result;
}

async function pin(id: string) {
  const result = await execute<boolean>(
    `UPDATE files SET pinned = 1 - pinned WHERE id = ?`,
    [id]
  );

  return result;
}

async function remove(ids: string[]) {
  const result = await execute<boolean>(`DELETE FROM files WHERE id IN (?)`, [
    ids,
  ]);

  return ids;
}

const getNameWithPaths = async (ids: string[]) => {
  const result = await execute<{ filename: string; path: string }[]>(
    `SELECT name AS filename, path FROM files WHERE id IN (?) LIMIT 50`,
    [ids]
  );

  return result;
};

export default {
  getMultiple,
  getNameWithPaths,
  get,
  search,
  create,
  update,
  pin,
  remove,
};
