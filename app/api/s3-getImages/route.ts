import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION, // Replace with your region
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

export const GET = async () => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
     Prefix: "heroImages/", // only get images from this folder
    MaxKeys: 100, // Optional: limits the number of objects returned
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    // Check if data exists and contains any objects
    if (data && data.Contents && data.Contents.length > 0) {
        const images = data.Contents
        .filter(item => item.Key && !item.Key.endsWith('/')) // Ensure Key is defined and exclude common prefixes
        .map(item => ({
          key: item.Key,
          url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${item.Key}`,
        }));
  
      return NextResponse.json(images);
    } else {
      // Handle case where no objects are found
      return NextResponse.json({
        message: "No images found in the specified S3 bucket.",
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err});
  }
};
