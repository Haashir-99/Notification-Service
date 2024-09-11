require("dotenv").config();
const axios = require("axios");

exports.sendTransactionalEmail = async (req, res, next) => {
  const { recipient, subject, params } = req.body;
  const templateId = req.body.templateId || 1;

  if (!recipient || !subject) {
    const error = new Error("Recipient or subject is empty or invalid.");
    error.statusCode = 400;
    next(error);
  }

  const data = {
    sender: { name: "Bubbles Company", email: "haashirazhar666@gmail.com" },
    to: [{ email: recipient.email, name: recipient.name }],
    subject: subject,
    templateId: templateId,
    params: params,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
    res.status(200).json({
      message: "Email sent successfully",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendBulkEmails = async (req, res, next) => {
  const { recipients, subject, params } = req.body;
  const templateId = req.body.templateId || 1;

  if (!Array.isArray(recipients) || recipients.length === 0) {
    const error = new Error("Recipients list is empty or invalid.");
    error.statusCode = 400;
    next(error);
  }

  const data = {
    sender: { name: "Bubbles Company", email: "haashirazhar666@gmail.com" },
    to: recipients,
    subject: subject,
    templateId: templateId,
    params: params,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    res.status(200).json({
      message: "Bulk emails sent successfully",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendScheduledEmail = async (req, res, next) => {
  const { recipient, subject, params, scheduleTime } = req.body;
  const templateId = req.body.templateId || 1;

  try {
    if (!recipient || !subject) {
      const error = new Error("Recipient or subject is empty or invalid.");
      error.statusCode = 400;
      next(error);
    }

    if (!scheduleTime || isNaN(scheduleTime)) {
      const error = new Error("Invalid schedule time. It should be a valid UNIX timestamp.");
      error.statusCode = 400;
      return next(error);
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (scheduleTime <= currentTime) {
      const error = new Error("The scheduled time must be in the future.");
      error.statusCode = 400;
      return next(error);
    }

    const data = {
      sender: { name: "Bubbles Company", email: "haashirazhar666@gmail.com" },
      to: [{ email: recipient.email, name: recipient.name }],
      subject: subject,
      templateId: templateId,
      params: params,
      sendAt: scheduleTime,
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
    res.status(200).json({ message: "Email scheduled successfully", data: response.data });
  } catch (error) {
    next(error);
  }
};
