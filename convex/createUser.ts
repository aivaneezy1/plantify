import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

export const userTable = mutation({
  args: {
    status:v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    imagesUrl: v.array(v.string()),
    apiCallTotal: v.number(),
    apiCallRemaining: v.number(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {

     // const get User Token 
     const identity = await ctx.auth.getUserIdentity();
     if(!identity){
      throw new Error("User is not signed")
     }
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
      status: "Trial",
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


export const updateUserStatus = mutation({
   args: { userId: v.id("users"), status:v.string(), apiCallTotal:v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
        status: args.status,
        apiCallTotal: args.apiCallTotal
    })
  }
})



// Get current usser
export const currentUser = query({
  args: {},
  handler: async (ctx, args) => {
    // Get the identity of the current user
    const getCurrentUser = await ctx.auth.getUserIdentity();


    if (!getCurrentUser) {
      throw new Error("User is not authenticated");
    }
    const tokenSlice:string | undefined = getCurrentUser.tokenIdentifier.split("|").pop()

    // Query the user using the tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", tokenSlice!)
      ).unique();
    // Handle the case where no user is found
    if (!user) {
      throw new Error("User not found in the database");
    }

    return user;
  },
});


