"use client";
import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import { Footer } from "./components/Footer";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const storeUser = useMutation(api.createUser.userTable);
  const [hasStoredUser, setHasStoredUser] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  let firstName: string | undefined = user?.firstName || "";
  let lastName: string | undefined = user?.lastName || "";
  let email: string | undefined = user?.primaryEmailAddress?.emailAddress || "";
  let apiCallTotal: number = 0;
  let apiCallRemaining: number = 100;
  let id: string | undefined = user?.id || "";

  useEffect(() => {
    const handleStoreUser = async () => {
      // User signing-up for the first time
      if (isLoaded && isSignedIn && id && !hasStoredUser) {
        try {
          // First, check if the user already exists in the database
          const existingUser = await storeUser({
            firstName,
            lastName,
            email,
            apiCallTotal,
            apiCallRemaining,
            tokenIdentifier: id,
          });

          if (existingUser) {
            setHasStoredUser(true); // Set the flag to prevent future executions
          }
        } catch (error) {
          console.error("Error storing user:", error);
        }
      }
    };

    handleStoreUser();
  }, [isLoaded, isSignedIn, id, hasStoredUser, storeUser]);

  return (
    <div>
      <Hero />
      <Footer />
    </div>
  );
}
