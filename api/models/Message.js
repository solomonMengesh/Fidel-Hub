// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema(
//   {
//     conversation: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Conversation",
//       required: true,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: String,
//     type: {
//       type: String,
//       enum: ["text", "file"],
//       default: "text",
//     },
//     fileInfo: {
//       name: String,
//       type: String,
//       size: Number,
//       url: String,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", MessageSchema);
// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema(
//   {
//     conversation: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Conversation",
//       required: true,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: String,
//     type: {
//       type: String,
//       enum: ["text", "file"],
//       default: "text",
//     },
//     fileInfo: {
//       name: String,
//       type: String,
//       size: Number,
//       url: String,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", MessageSchema);
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    type: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },
    fileInfo: {
      // Changed this to properly define the object structure
      name: String,
      type: String,
      size: Number,
      url: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);