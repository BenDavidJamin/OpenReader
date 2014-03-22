var mongoose = require('mongoose');
var fs = require("fs");
var zipfile = require('zipfile');
var cheerio = require('cheerio');
var cleanCSS = require('clean-css');

var Files = mongoose.model('Files', require('../models/files'));



