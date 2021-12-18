const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  username:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required:true
  },
  duration:{
    type: Number,
    required: true
  },
  date:{
    type:String,
    required:true
  },
  userID:{
    type:String,
    required:true
  }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = Exercise; 
