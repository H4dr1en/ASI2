var express = require("express");
var multer = require("multer");
var router = express.Router();
var CONFIG = JSON.parse(process.env.CONFIG);
module.exports = router;

var contentController = require('../controllers/content.controllers');

var multerMiddleware = multer({ "dest": CONFIG.tmpDirectory });

router.route("/contents")
        .get(contentController.getContents)
        .post(multerMiddleware.single("file"), contentController.create);

router.route("/contents/:id")
        .get(contentController.getContent)

router.param('id', function (req, res, next, id) {
    req.id = id;
    next();
});