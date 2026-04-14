const mongoose = require('mongoose');

const subCatSchema = new mongoose.Schema({
  label: String,
  name: String
});

const catSchema = new mongoose.Schema({  
  name: String,
  subCat: [{type: mongoose.Schema.Types.ObjectId, ref: 'sub-category', required: true }],
  image:String,
  icon:String
},{timestamps:true});

module.exports = mongoose.model('Category', catSchema);
