// import mongoose from "mongoose";

// const ConversationSchema = new mongoose.Schema(
//   {
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     participants: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//     ],
//     isBlocked: {
//       type: Boolean,
//       default: false,
//     },
//     blockedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     lastMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Conversation", ConversationSchema);
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);