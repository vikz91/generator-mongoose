var express = require('express');
var app = express();
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {

	res.status(200).json({err:false,data:"API Service Working fine!"});

});

module.exports = router;
