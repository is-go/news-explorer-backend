const express = require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();

const { getCurrentUser } = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);

module.exports = router;
