/*
 * mockproxy
 * 
 *
 * Copyright (c) 2015 Kristof Konings
 * Licensed under the MIT license.
 */

'use strict';

var server=require("server.js");

module.exports = function(grunt) {

  grunt.registerMultiTask('mockproxy', 'mockproxy', server);

};
