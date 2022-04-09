import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import filesService from "../services/files.service";
import copyWorkerService from "../services/copyWorker.service";

const send: RequestHandler = async (req, res) => {
  try {
    const recipient = req.body.recipient;
    const topic = req.body.topic;
    const content = req.body.content;
    const attachments = req.body.attachments;
    let parsedAttachments: { filename: string; path: string }[] = [];

    if (typeof recipient !== "string") throw new Error("Invalid recipient");
    if (typeof topic !== "string") throw new Error("Invalid topic");
    if (typeof content !== "string") throw new Error("Invalid content");
    if (attachments && typeof attachments !== "string")
      throw new Error("Invalid attachemnts");

    if (attachments) {
      parsedAttachments = await filesService.getNameWithPaths(
        attachments.split(",")
      );
      parsedAttachments = parsedAttachments.map(({ filename, path }) => {
        return { filename, path };
      });
    }

    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "my.smtp.credencials@gmail.com", // generated ethereal user
          pass: "etc/passwd/smtp", // generated ethereal password
        },
      })
    );

    const info = await transporter.sendMail({
      from: "ZSE", // sender address
      to: recipient, // list of receivers
      subject: topic, // Subject line
      text: content, // plain text body
      attachments: parsedAttachments,
    });

    await copyWorkerService.create({
      recipient,
      topic,
      content,
      attachments: attachments || "",
    });

    res.send({ recipients: info.accepted });
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send({ message: "Error while sending" });
  }
};

export default {
  send,
};
