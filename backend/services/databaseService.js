const mongoose = require('mongoose');
const Result = require('../models/Result');
const Task = require('../models/Task');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.saveResult = async (type, data) => {
  try {
    const result = new Result({
      type,
      scores: data.scores,
      feedback: data.feedback,
      detailedAnalysis: data.detailedAnalysis,
      timestamp: new Date()
    });

    await result.save();
    return result;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
};

exports.getProgress = async (type) => {
  try {
    const results = await Result.find({ type })
      .sort({ timestamp: -1 })
      .limit(10);
    
    return results.map(r => ({
      scores: r.scores,
      timestamp: r.timestamp
    }));
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

exports.getAllResults = async () => {
  try {
    return await Result.find()
      .sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error fetching all results:', error);
    throw error;
  }
};

exports.getTasks = async (type) => {
  try {
    return await Task.find({ type });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

exports.saveTask = async (taskData) => {
  try {
    const task = new Task(taskData);
    await task.save();
    return task;
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
};

exports.updateTask = async (id, updateData) => {
  try {
    return await Task.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

exports.deleteTask = async (id) => {
  try {
    await Task.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}; 