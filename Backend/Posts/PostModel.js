const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['c', 'cpp', 'java', 'js', 'py', 'go', 'ruby', 'php']
  },
  fileContent: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StackUser',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ fileName: 1 }, { unique: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;