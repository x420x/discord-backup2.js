const mongoose = require("mongoose");

const sasa = mongoose.Schema({
    rolid: String,
    name: String,
    members: Array
  });
  
  module.exports = mongoose.model("rolebackup", sasa); 