import { v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const sketchImageTable = mutation({
  args: {
    text: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const newSketchImage = await ctx.db.insert("imageSketch", {
      text: args.text,
      image: args.image,
    });
    // ID of a document in the _id field
    const retrievedSketch = await ctx.db.get(newSketchImage);
    await ctx.scheduler.runAfter(0, internal.createImage.generateSketchImage, {
      text: args.text,
      image: args.image,
      sketchId: retrievedSketch?._id!,
    });

    return newSketchImage;
  },
});

export const generateSketchImage = internalAction({
  args: {
    text: v.string(),
    image: v.string(),
    sketchId: v.id("imageSketch"),
  },
  handler: async (ctx, args) => {
    try {
      const res = await fetch("https://stablediffusionapi.com/api/v3/img2img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "77smNxrQvXtezDegnAtDKTqRebxFWnxzqvC6FcX7n0HaBc4bduSsQF2pu42S",
          prompt: args.text,
          negative_prompt: null,
          init_image: args.image,
          width: "512",
          height: "512",
          samples: "1",
          num_inference_steps: "30",
          safety_checker: "no",
          enhance_prompt: "yes",
          guidance_scale: 7.5,
          strength: 0.7,
          seed: null,
          base64: "no",
          webhook: null,
          track_id: null,
        }),
      });
      if(res.ok){
        const data = await res.json();
        await ctx.scheduler.runAfter(0, internal.createImage.updateSketchImage, {
            sketchId: args.sketchId,
            result: data.init_image
        })
      }
    } catch (err) {
      console.log(err);
    }
  },
});

export const updateSketchImage = internalMutation({
    args: {sketchId: v.id("imageSketch"), result: v.string()},
    handler: async(ctx,args) =>{
        await ctx.db.patch(args.sketchId, {
            image: args.result
        })
    }
})

// Newly Create Images
export const getImage = query({
  args: { sketchId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("sketch")
      .filter((q) => q.eq(q.field("_id"), args.sketchId))
      .collect(); // Ensure you return the results
  },
});
