import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningSession',
    required: true,
  },
  chats: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      messages: [
        {
          id: { type: String, required: true },
          role: { type: String, enum: ['user', 'ai'], required: true },
          text: { type: String, required: true },
          options: [String],
          typing: { type: Boolean }
        }
      ]
    }
  ]
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
