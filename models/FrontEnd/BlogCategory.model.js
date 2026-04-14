const mongoose = require('mongoose');


const catSchema = new mongoose.Schema({  
  name: String,
},{timestamps:true});

module.exports = mongoose.model('blog-category', catSchema);
