import mongoose from 'mongoose';

const courseSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  instructorId: {
    type: Number,
    required: true
  },
  departmentId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  reviewRating: {
    type: Number
  },
  surveyRating: {
    type: Number
  },
  description: {
    type: String,
    required: true
  },
});

courseSchema.methods.getId = function() {
  return this.id;
}

const Course = module.exports = mongoose.model('course', courseSchema)
