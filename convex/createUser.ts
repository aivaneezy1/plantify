import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

export const userTable = mutation({
  args: {
    status: v.string(),
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
    if (!identity) {
      throw new Error("User is not signed");
    }
    console.log("server identity", identity);
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
      imagesUrl: [],
      apiUsage: 0,
      apiCallTotal: args.apiCallTotal,
      apiCallRemaining: args.apiCallRemaining,
      apiUsageTimeStamp: [],
      transactionsTimeStamp: [],
      bits: [],
      tokenIdentifier: args.tokenIdentifier,
    });

    return newUsers;
  },
});

/*
Update the user table with images., 
Update the create date of the images
Update Api call Usage by -5 everytime a API call use
*/
export const updateUsersTable = internalMutation({
  args: {
    id: v.id("users"),
    images: v.array(v.string()),
    apiUsage: v.number(),
    apiCallRemaining: v.number(),
    apiUsageTimeStamp: v.string(),
  },
  handler: async (ctx, args) => {
    const userRecord = await ctx.db.get(args.id);
    // Check if the imagesUrl already exists, otherwise default to an empty array

    const currentImages = userRecord?.imagesUrl || [];

    // Use the spread operator to add the new images to the existing array
    const updatedImages = [...currentImages, ...args.images];

    // Adding 1 on the api usage everytime a API call is made
    const prevApiUsage = userRecord?.apiUsage || 0;
    const apiUsageTotal = prevApiUsage + args.apiUsage;

    // Substracting by 10 on the API call remaining everytime a Api call is made
    const prevTotalApiCall = userRecord?.apiCallRemaining || 0;
    const apiCallTotalRemaining = prevTotalApiCall - args.apiCallRemaining;
    // get the prev date
    const prevDate = userRecord?.apiUsageTimeStamp || [];
    const updatedDate = [args.apiUsageTimeStamp, ...prevDate];
    await ctx.db.patch(args.id, {
      imagesUrl: updatedImages,
      apiUsage: apiUsageTotal,
      apiCallRemaining: apiCallTotalRemaining,
      apiUsageTimeStamp: updatedDate,
    });
  },
});

/**
 Update User
 -status from Trial -> Pro once they acquired a bits
 - Total Api call remaining substract
 - Total Api call the user have
 - Bits acquired for every transactions made.
 */
export const updateUserStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
    apiCallTotal: v.number(),
    transactionsTimeStamp: v.string(),
    bits: v.number(),
  },
  handler: async (ctx, args) => {
    const userRecord = await ctx.db.get(args.userId);
    const prevTotalApiCall: number = userRecord?.apiCallTotal || 0;
    const totalApiRemaining: number = prevTotalApiCall + args.apiCallTotal;
    const timestamps = userRecord?.transactionsTimeStamp || [];
    const bits = userRecord?.bits || [];

    await ctx.db.patch(args.userId, {
      status: args.status,
      apiCallTotal: prevTotalApiCall + args.apiCallTotal,
      apiCallRemaining: totalApiRemaining,
      transactionsTimeStamp: [args.transactionsTimeStamp, ...timestamps],
      bits: [args.bits, ...bits],
    });
  },
});

// Get current usser
export const currentUser = query({
  args: {},
  handler: async (ctx, args) => {
    // Get the identity of the current user
    const getCurrentUser = await ctx.auth.getUserIdentity();

    if (!getCurrentUser) {
      throw new Error("User is not authenticated");
    }
    const tokenSlice: string | undefined = getCurrentUser.tokenIdentifier
      .split("|")
      .pop();

    // Query the user using the tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenSlice!))
      .unique();

    // Handle the case where no user is found
    if (!user) {
      throw new Error("User not found in the database");
    }

    return user;
  },
});
