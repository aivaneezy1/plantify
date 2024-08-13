import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";


export const sketchTable = mutation({
    args: {text: v.string(), image: v.string()},
    handler: async(ctx, args) =>{
        const newSketch = await ctx.db.insert("sketch", {text: args.text, image: args.image})

        return newSketch
    }
})


export const getSketchData = query({
    args:{},
    handler: async(ctx) =>{
        return ctx.db.query("sketch").collect();
    }
})