"use strict";

const must = require("must/register");
require("@babel/register");
require("@babel/polyfill");

global.must = must;
