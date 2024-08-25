import {
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

// Creating a table
export const sketchTable = mutation({
  args: { text: v.string(), image: v.array(v.string()) },
  handler: async (ctx, args) => {
    const newSketch = await ctx.db.insert("sketch", {
      text: args.text,
      images: args.image,
    });
    // ID of a document in the _id field
    const retrievedSketch = await ctx.db.get(newSketch);

    await ctx.scheduler.runAfter(0, internal.createSketch.generateImageAction, {
      sketchId: retrievedSketch?._id!,
      text: args.text,
      image: args.image,
    });

    return newSketch;
  },
});

// RUN  third party services
export const generateImageAction = internalAction({
  args: { text: v.string(), image: v.array(v.string()), sketchId: v.id("sketch") },
  handler: async (ctx, args) => {
    const res = await fetch("https://modelslab.com/api/v6/realtime/text2img", {
      method: "POST",
       headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify({
        key: process.env.STABLEDIFFUSION_API_TOKEN,
        prompt:
          args.text,
        negative_prompt: "bad quality",
        width: "512",
        height: "512",
        safety_checker: false,
        seed: null,
        samples: 2,
        base64: false,
        webhook: null,
        track_id: null,
      }),
    });
    const data = await res.json()
    console.log(data)
    console.log("data porxy", data.proxy_links)
    //Update the image with the text
    await ctx.scheduler.runAfter(0, internal.createSketch.updateSketchResult, {
      sketchId: args.sketchId,
      result: data.proxy_links
    })
  },

});

// updated SketchResult
export const updateSketchResult = internalMutation({
  args: { sketchId: v.id("sketch"), result: v.array(v.string())},
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sketchId, {
      images: args.result,
    });
  },
});

// Getting data from convex table
export const getSketchData = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("sketch").collect();
  },
});
