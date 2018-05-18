import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  subject:{
    type: String,
    required: true
  },
  description: String,
  hours: String,
  status: {
    type: Number,
    default: 1
  },
  user: String,
  theme: String,
  goals: String
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
