export type TFIle = {
  id: number;
  type: string;
  name: string;
  size: number;
  path: string;
  dateCreated: number;
};

export type TCopyWorker = {
  id: number;
  recipient: string;
  topic: string;
  content: string;
  attachments: string;
  dateCreated: number;
};
