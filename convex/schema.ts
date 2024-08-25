import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sketch: defineTable({
    images: v.array(v.string()),
    text: v.string(),
  }),
  todos: defineTable({ text: v.string() }),
});