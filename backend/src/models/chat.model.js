import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doc',
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      default: 'openai',
      trim: true,
    },
    model: {
      type: String,
      default: null,
      trim: true,
    },
    sources: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;
