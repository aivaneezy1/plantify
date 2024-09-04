import {
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";

export const userTable = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    apiCallTotal: v.number(),
    apiCallRemaining: v.number(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // check if user is already in our database
    const usersExist = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (usersExist) {
      return usersExist._id;
    }
    // If user dont exist in our database yet. we create one
    const newUsers = await ctx.db.insert("users", {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,

      apiCallTotal: args.apiCallTotal,
      apiCallRemaining: args.apiCallRemaining,
      tokenIdentifier: args.tokenIdentifier,
    });

    return newUsers;
  },
});
