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
  args: {
    text: v.string(),
    image: v.array(v.string()),
    numberOfSamples: v.number(),
  },
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
      numberOfSamples: args.numberOfSamples,
    });

    return newSketch;
  },
});

// RUN  third party services
export const generateImageAction = internalAction({
  args: {
    text: v.string(),
    image: v.array(v.string()),
    sketchId: v.id("sketch"),
    numberOfSamples: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const res = await fetch(
        "https://modelslab.com/api/v6/realtime/text2img",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "77smNxrQvXtezDegnAtDKTqRebxFWnxzqvC6FcX7n0HaBc4bduSsQF2pu42S",
            prompt: args.text,
            negative_prompt: "bad quality",
            width: "512",
            height: "512",
            safety_checker: false,
            seed: null,
            samples: args.numberOfSamples,
            base64: false,
            webhook: null,
            track_id: null,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        //Update the image with the text
        await ctx.scheduler.runAfter(
          0,
          internal.createSketch.updateSketchResult,
          {
            sketchId: args.sketchId,
            result: data.proxy_links,
          }
        );
      }else{
        console.log("response error in fetch")
      }
    } catch (err) {
      console.log("err", err);
    }
  },
});

// Generate images from a sketch

// updated SketchResult
export const updateSketchResult = internalMutation({
  args: { sketchId: v.id("sketch"), result: v.array(v.string()) },
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

// Getting the newly created images
export const getImage = query({
  args: { sketchId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("sketch")
      .filter((q) => q.eq(q.field("_id"), args.sketchId))
      .collect(); // Ensure you return the results
  },
});
