import { Document, model, models, Schema } from "mongoose";

// interface
export interface IUser extends Document {
  email: string;
  name: string;
  role: "admin" | "student" | "dev";
}

// schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "student", "dev"],
      default: "student",
    },
  },
  { timestamps: true }
);

// export
export const User = models.users || model<IUser>("users", userSchema);
