const express = require("express");
const { body } = require("express-validator");

const mailController = require("../controllers/mail");

const router = express.Router();

router.post("/send-transactional", mailController.sendTransactionalEmail);

router.post("/send-bulk-emails", mailController.sendBulkEmails);

router.post("/send-scheduled", mailController.sendScheduledEmail);

module.exports = router;
