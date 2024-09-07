import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  imageSketch: defineTable({
    userTableId: v.string(),
    userId: v.string(),
    image: v.string(),
    text: v.string(),
    status: v.string(),
  }),
  sketch: defineTable({
    userTableId: v.string(),
    userId: v.string(),
    images: v.array(v.string()),
    text: v.string(),
    width: v.string(),
    height: v.string(),
  }),
  users: defineTable({
    status:v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    imagesUrl: v.array(v.string()),
    apiCallTotal: v.number(),
    apiCallRemaining: v.number(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  todos: defineTable({ text: v.string() }),
});
