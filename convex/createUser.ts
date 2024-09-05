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
    imagesUrl: v.array(v.string()),
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
      imagesUrl: [""],
      apiCallTotal: args.apiCallTotal,
      apiCallRemaining: args.apiCallRemaining,
      tokenIdentifier: args.tokenIdentifier,
    });

    return newUsers;
  },
});

export const updateUsersTable = internalMutation({
  args: { id: v.id("users"), images: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userRecord = await ctx.db.get(args.id);
   
    // Check if the imagesUrl already exists, otherwise default to an empty array
    const currentImages = userRecord?.imagesUrl || [];

    // Use the spread operator to add the new images to the existing array
    const updatedImages = [...currentImages, ...args.images];

    await ctx.db.patch(args.id, {
      imagesUrl: updatedImages,
    });
  },
});
