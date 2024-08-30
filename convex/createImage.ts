import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
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

    console.log("image", args.image);
    console.log("text", args.text);
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
      const response = await fetch(args.image);
      const imageBlob = await response.blob();
      const formData = new FormData();
      formData.append("image", imageBlob, "sketch.png"); // Use a filename here
      formData.append("prompt", args.text);
      const res = await fetch(
        "https://api.stability.ai/v2beta/stable-image/control/sketch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer sk-8HLs5WSLu9ym4bpWY104rKW8bDP59nw081Lv201IYllMot5H`,
            Accept: "application/json", // Adjust if needed,
          },
          body: formData,
        }
      );
      if (res.status === 200) {
        const data = await res.json();
       

        const base64String  = data.image;
        const mimeType = "image/png"
        const dataUrl = `data:${mimeType};base64,${base64String}`
        await ctx.scheduler.runAfter(
          0,
          internal.createImage.updateSketchImage,
          {
            sketchId: args.sketchId,
            result: dataUrl,
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
});

// updating the table with the newly generated image
export const updateSketchImage = internalMutation({
  args: { sketchId: v.id("imageSketch"), result: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sketchId, {
      image: args.result,
    });
  },
});

// Getting all images of the table
export const getAllImage = query({
  args:{},
  handler: async(ctx) =>{
     return ctx.db.query("imageSketch").collect();
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
