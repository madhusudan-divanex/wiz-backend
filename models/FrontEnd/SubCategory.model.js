const mongoose = require('mongoose');

const subCatSchema = new mongoose.Schema({  
  name: String,
},{timestamps:true});

module.exports = mongoose.model('sub-category', subCatSchema);
