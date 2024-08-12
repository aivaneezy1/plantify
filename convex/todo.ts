import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const createTodo = mutation({
    // args take data from front-end
  args: { text: v.string() },
  // context(database) and args 
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("todos", { text: args.text });
    return newTaskId;
  },
});




export const getTodo = query({
    args: {},
    handler: async(ctx) =>{
        return ctx.db.query("todos").collect();
    }
})