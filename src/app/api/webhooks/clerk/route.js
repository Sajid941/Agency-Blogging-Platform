const { Webhook } = require("svix");
const { headers } = require("next/headers");
const { WebhookEvent } = require("@clerk/nextjs/server");
const { default: connect } = require("utils/db");
const { default: User } = require("@/models/User");

async function POST(req) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error(
            "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
        );
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headerPayload  = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error: Missing Svix headers", {
            status: 400,
        });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt;

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            "svix-id":  svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Error: Could not verify webhook:", err);
        return new Response("Error: Verification error", {
            status: 400,
        });
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    if (eventType === "user.created") {
        const {
            id,
            email_addresses,
            image_url,
            first_name,
            last_name,
            username,
        } = evt.data;
        if (!email_addresses || email_addresses.length === 0 ||!id) {
            console.error("No email address found in webhook payload.");
            return new Response("Error: Missing email address", { status: 400 });
        }
    
        const user = {
            clerkId: id,
            firstName: first_name || "N/A",
            lastName: last_name || "N/A",
            photo: image_url || "",
            email: email_addresses[0]?.email_address,
            username: username || `user-${id}`,
        };
    
        try {
            await connect();
            const newUser = await User.create(user);
            return new Response(JSON.stringify(newUser), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating user:", error);
            return new Response("Error creating user", { status: 500 });
        }
    }
    console.log(
        `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", body);

    return new Response("Webhook received", { status: 200 });
}

module.exports = { POST };