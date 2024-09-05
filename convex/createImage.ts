import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Id } from "./_generated/dataModel";
// STABLE API key
function stableApi() {
  let apikey: string | undefined;
  apikey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;
  return apikey;
}

function API_KEY(api_key: string) {
  let apikey: string | undefined;
  apikey = api_key;
  return apikey;
}
// AWS S3 Credentials

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: API_KEY( process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || ""),
    secretAccessKey:  API_KEY( process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || ""),
  },
});

// Function to convert base64 string into a blob object. Using atob() and Blob()
/*
https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
https://saturncloud.io/blog/creating-a-blob-from-a-base64-string-in-javascript/#:~:text=BLOB%20in%20JavaScript-,To%20convert%20a%20Base64%20string%20to%20a%20BLOB%20in%20JavaScript,creates%20a%20new%20BLOB%20object.
 */
function base64toBlob(base64String: string, contentType: string = "") {
  const byteCharacters = atob(base64String); // convert base64 string into a binary string data.
  const byteArrays: number[] = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    //charCodeAt() method of String values returns an integer between 0 and 65535. Applying charCode() to create array of byte for each character in the string
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  // You can convert this array of byte values into a real typed byte array by passing it to the Uint8Array constructor.
  const byteArray = new Uint8Array(byteArrays);
  const blob = new Blob([byteArray], { type: contentType });
  return blob;
}

export const sketchImageTable = mutation({
  args: {
   userTableId: v.id("users"),
    userId: v.string(),
    text: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const newSketchImage = await ctx.db.insert("imageSketch", {
      userTableId: args.userTableId,
      userId: args.userId,
      text: args.text,
      image: args.image,
      status: "pending",
    });

    // console.log("userTableId", args.userTableId)
    //  console.log("userId", args.userId)
    // console.log("text", args.text)
    // console.log("image", args.image)
    // ID of a document in the _id field
    const retrievedSketch = await ctx.db.get(newSketchImage);
   try{
       await ctx.scheduler.runAfter(0, internal.createImage.generateSketchImage, {
        userTableId: args.userTableId,
        text: args.text,
        image: args.image,
        sketchId: retrievedSketch?._id!,
      });
   }catch(err){
    console.log(err);
   }

    return newSketchImage;
  },

  
});



export const generateSketchImage = internalAction({
  args: {
    userTableId:v.id("users"),
    text: v.string(),
    image: v.string(),
    sketchId: v.id("imageSketch"),
  },
  handler: async (ctx, args) => {
    try {
      let path: string = `generatedSketch/${Date.now()}.png`;
      const response = await fetch(args.image);
      // creating a blob
      const imageBlob = await response.blob();
      const formData = new FormData();
      formData.append("image", imageBlob, "sketch.png"); // Use a filename here
      formData.append("prompt", args.text);

      const res = await fetch(
        "https://api.stability.ai/v2beta/stable-image/control/sketch",
        {
          method: "POST",
          headers: {
            // currently using the dummy API key
            Authorization: `Bearer ${API_KEY(process.env.NEXT_PUBLIC_STABILITY_API_KEY || "")}`,
            Accept: "application/json", // Adjust if needed,
          },
          body: formData,
        }
      );

      const data = await res.json();
      //Converting the base64 string into a blob using the base64toBlob function.
      const imageConvertedToBlob = base64toBlob(data.image, "image/png");

      // S3  upload parameters
      const uploadParams = {
        Bucket: API_KEY(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || ""),
        Key: path,
        Body: imageConvertedToBlob,
        ContentType: "image/png",
      };

           // Upload the image to aws s3 bucket
      await s3.send(new PutObjectCommand(uploadParams));

      // // Construct the URL to access the image
       const imageUrl = `https://${API_KEY(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "")}.s3.eu-north-1.amazonaws.com/${path}`;


      if (res.status === 200) {
        await ctx.scheduler.runAfter(
          0,
          internal.createImage.updateSketchImage,
          {
            sketchId: args.sketchId,
            result: imageUrl,
          }
        );
        // Update the user table with the image generated.
        await ctx.scheduler.runAfter(0, internal.createUser.updateUsersTable, {
            id:args.userTableId,
            images: [imageUrl]
        })
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
      status: "completed",
    });
  },
});

// Newly Create Images
export const getImage = query({
  args: { sketchId: v.string() },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("imageSketch")
      .filter((q) => q.eq(q.field("_id"), args.sketchId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    return { success: true, image: images };
  },
});




// Getting all images of the table
export const getAllImage = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("imageSketch").collect();
  },
});
