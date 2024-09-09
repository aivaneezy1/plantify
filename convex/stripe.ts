import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import Stripe from "stripe";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { format } from "date-fns";

// Generate a checkout Link for the user
export const pay = action({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const clerkUser = await ctx.auth.getUserIdentity();
    const dbUser = await ctx.runQuery(api.createUser.currentUser, {});

    if (!dbUser || !clerkUser) {
      throw new Error("User not authenticated");
    }

    if (!clerkUser.emailVerified) {
      throw new Error("User email is not verified");
    }

    // define stripe object
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY!, {
      apiVersion: "2024-06-20",
    });

    const redirectDomain = process.env.NEXT_PUBLIC_HOSTING_URL;

    // Generating a session to direct the user to begin Checkout.
    const session: Stripe.Response<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.create({
        line_items: [
          {
            // setting the amount dynamically.
            price_data: {
              currency: "eur",
              product_data: {
                name: "Bits Purchase",
              },
              /*
              This is calculated in cents
              1 euro = 100 cents
              10 euro = 1000 cents
              */
              unit_amount: args.amount * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: dbUser._id,
        },
        customer_email: clerkUser.email,
        mode: "payment",
        success_url: `${redirectDomain}/dashboard?payment=true`,
        cancel_url: `${redirectDomain}/dashboard?payment=false`,
      });

    
    return {
      url: session.url,
      success: true,
    };
  },
});

type MetaData = {
  userId: Id<"users">;
};

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY!, {
      apiVersion: "2024-06-20",
    });

    const webHookSecret = process.env
      .NEXT_PUBLIC_WEBHOOK_SIGNING_SERCRET_DEV as string;

    try {
      const event = await stripe.webhooks.constructEventAsync(
        args.payload,
        args.signature,
        webHookSecret
      );
      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: MetaData;
      };
      if (event.type === "checkout.session.completed") {
  
        // Extract userId from metadata
        const userId = completedEvent.metadata.userId;
        // Extract the total amount converted in cents from metadata
        const totalApiCall = completedEvent.amount_total! / 2 || 0;
        const totalBitsAcquired = completedEvent.amount_total! / 2 || 0;

        // Extract the time stamp
        const transactionTimestamp = completedEvent.created;
        const formattedDate = format(
          new Date(transactionTimestamp * 1000),
          "dd/MM/yy, HH:mm:ss"
        );
        await ctx.runMutation(api.createUser.updateUserStatus, {
          userId: userId,
          status: "Pro",
          apiCallTotal: totalApiCall,
          transactionsTimeStamp: formattedDate,
          bits: totalBitsAcquired,
        });
      }

      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, error: (err as { messagge: string }).messagge };
    }
  },
});
