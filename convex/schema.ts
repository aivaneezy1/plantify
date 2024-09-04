import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  imageSketch: defineTable({
    image: v.string(),
    text: v.string(),
    status: v.string(),
  }),
  sketch: defineTable({
    images: v.array(v.string()),
    text: v.string(),
    width: v.string(),
    height: v.string(),
  }),
  todos: defineTable({ text: v.string() }),
});
