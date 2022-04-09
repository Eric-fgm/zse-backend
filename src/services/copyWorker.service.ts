import { execute } from "../services/db.service";
import helpers from "../utils/helper.util";
import type { TCopyWorker } from "../types";

const getMultiple = async ({ page = 1, itemsPerPage = 50, pinned = false }) => {
  const paginationMeta = helpers.paginationMeta(page, itemsPerPage);
  const rows = await execute<TCopyWorker[]>(
    `SELECT id, recipient, topic, content, attachments, IF(pinned > 0, TRUE, FALSE) AS isPinned, unix_timestamp(date_created) as dateCreated
    FROM copy_worker ${
      pinned ? "WHERE pinned = 1" : ""
    } ORDER BY date_created DESC LIMIT ?,?`,
    [paginationMeta.offset, itemsPerPage]
  );

  return {
    copyWorker: rows,
    meta: paginationMeta,
  };
};

const get = async (ids: string[], columns: string[]) => {
  const rows = await execute<any[]>(
    `SELECT ?? FROM copy_worker WHERE id IN (?)`,
    [columns, ids]
  );
  return rows;
};

const search = async (query: string) => {
  query = `%${query}%`;
  const rows = await execute<any[]>(
    `SELECT id, recipient, topic, content, attachments, IF(pinned > 0, TRUE, FALSE) AS isPinned, unix_timestamp(date_created) as dateCreated FROM copy_worker
    WHERE recipient LIKE ?
    OR topic LIKE ?
    OR content LIKE ?
    LIMIT 20`,
    [query, query, query]
  );
  return rows;
};

async function create(
  copyWorker: Omit<Omit<TCopyWorker, "dateCreated">, "id">
) {
  const result = await execute<boolean>(
    `INSERT INTO copy_worker 
    (recipient, topic, content, attachments) 
    VALUES 
    (?, ?, ?, ?)`,
    [
      copyWorker.recipient,
      copyWorker.topic,
      copyWorker.content,
      copyWorker.attachments,
    ]
  );

  return result;
}

async function pin(ids: string[]) {
  const result = await execute<boolean>(
    `UPDATE copy_worker SET pinned = 1 - pinned WHERE id IN (?)`,
    [ids]
  );
  return result;
}

async function remove(ids: string[]) {
  const result = await execute<boolean>(
    `DELETE FROM copy_worker WHERE id IN (?)`,
    [ids]
  );

  return result;
}

export default {
  getMultiple,
  get,
  search,
  pin,
  create,
  remove,
};
