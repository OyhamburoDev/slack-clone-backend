import mongoose from "mongoose";
import ROLES from "../constants/roles.js";

const MemberWorkspaceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  role: {
    type: String,
    enum: [ROLES.ADMIN, ROLES.MEMBER],
    default: ROLES.MEMBER,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const MemberWorkspaces = mongoose.model("Member", MemberWorkspaceSchema);
export default MemberWorkspaces;
