const mongoose = require('mongoose');

const subCatSchema = new mongoose.Schema({  
  name: String,
  icon:String
},{timestamps:true});

module.exports = mongoose.model('sub-category', subCatSchema);
