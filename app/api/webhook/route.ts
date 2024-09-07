import Stripe from "stripe"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"


const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "")
export const POST = async(req: NextRequest, res:NextResponse) =>{
    const payload = await req.json();

    const sig = req.headers.get("Stripe-Signature");

    try {
        let event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_PRIVATE_KEY!
        )

        console.log("event", event.type)
        return NextResponse.json({"message": event.type}, {status:200});
    }catch(err){
       return new NextResponse(`Error in stripe ${err}`)
    }
}