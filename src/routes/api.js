const express = require("express");
const router = express.Router();

// Controller
const ApiController = require("../controllers/api");

router.get("/ping", ApiController.ping_server);
router.get("/posts/:tags/:sortBy?/:direction?", ApiController.get_posts_param);

module.exports = router;
