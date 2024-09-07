import {
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { parseArgs } from "util";
// AWS S3 Credentials

function API_KEY(api_key: string) {
  let apikey: string | undefined;
  apikey = api_key;
  return apikey;
}

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: API_KEY(process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || ""),
    secretAccessKey: API_KEY(
      process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || ""
    ),
  },
});

// Creating a table
export const sketchTable = mutation({
  args: {
    userTableId: v.id("users"),
    userId: v.string(),
    text: v.string(),
    width: v.string(),
    height: v.string(),
    image: v.array(v.string()),
    numberOfSamples: v.number(),
  },

  handler: async (ctx, args) => {
    const newSketch = await ctx.db.insert("sketch", {
      userTableId: args.userTableId,
      userId: args.userId,
      text: args.text,
      width: args.width,
      height: args.height,
      images: args.image,
    });

    // ID of a document in the _id field
    const retrievedSketch = await ctx.db.get(newSketch);

    await ctx.scheduler.runAfter(0, internal.createSketch.generateImageAction, {
      userTableId: args.userTableId,
      text: args.text,
      width: args.width,
      height: args.height,
      numberOfSamples: args.numberOfSamples,
      sketchId: retrievedSketch?._id!,
    });

    return newSketch;
  },
});

// RUN  third party services
export const generateImageAction = internalAction({
  args: {
    userTableId: v.id("users"),
    text: v.string(),
    width: v.string(),
    height: v.string(),
    numberOfSamples: v.number(),
    sketchId: v.id("sketch"),
  },
  handler: async (ctx, args) => {
    if (args.text && args.numberOfSamples > 0) {
      try {
        let path: string = `Prompt-images/${Date.now()}.png`;
        const res = await fetch(
          "https://modelslab.com/api/v6/realtime/text2img",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: `${API_KEY(process.env.NEXT_PUBLIC_STABLEDIFFUSION_API_TOKEN || "")}`,
              prompt: args.text,
              negative_prompt: "bad quality",
              width: args.width,
              height: args.height,
              safety_checker: false,
              seed: null,
              samples: args.numberOfSamples,
              base64: false,
              webhook: null,
              track_id: null,
            }),
          }
        );

        // Upload the image to aws s3 bucket

        if (res.ok) {
          const data = await res.json();
          let imageUrl: string;
          for (let i = 0; i < data.proxy_links.length; i++) {
            imageUrl = data.proxy_links[i];

            const fetchImageURL = await fetch(imageUrl);
            // Making it a blob
            const imageBuffer = await fetchImageURL.blob();
            // S3 upload paramaters
            const uploadParms = {
              Bucket: API_KEY(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || ""),
              Key: path,
              Body: imageBuffer,
              ContentType: "image/png",
            };

            await s3.send(new PutObjectCommand(uploadParms));
          }

          //Update the image with the text
          await ctx.scheduler.runAfter(
            0,
            internal.createSketch.updateSketchResult,
            {
              sketchId: args.sketchId,
              result: data.proxy_links,
            }
          );

          // // // Update the user table with images generated;
          await ctx.scheduler.runAfter(
            0,
            internal.createUser.updateUsersTable,
            {
              id: args.userTableId,
              images: data.proxy_links,
            }
          );
        } else {
          console.log("response error in fetch");
        }
      } catch (err) {
        console.log("err", err);
      }
    } else {
      console.log("arguments needed");
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
