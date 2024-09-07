"use client";
import { useEffect, useState, useContext } from "react";
import Hero from "./components/Hero";
import { Footer } from "./components/Footer";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { DataContext } from "./Context/Provider";

export default function Home() {
  const storeUser = useMutation(api.createUser.userTable);
  const [hasStoredUser, setHasStoredUser] = useState<Boolean>(false);
  const { isLoaded, isSignedIn, user } = useUser();

  let firstName: string | undefined = user?.firstName || "";
  let lastName: string | undefined = user?.lastName || "";
  let email: string | undefined = user?.primaryEmailAddress?.emailAddress || "";
  let apiCallTotal: number = 0;
  let apiCallRemaining: number = 100;
  let id: string | undefined = user?.id || "";
  let image: string[] = [""];

  useEffect(() => {
    const handleStoreUser = async () => {
      // User signing-up for the first time
      if (isLoaded && isSignedIn && id && !hasStoredUser) {
        try {
          // First, check if the user already exists in the database
          const existingUser: Id<"users"> = await storeUser({
            status: "Trial",
            firstName,
            lastName,
            email,
            imagesUrl: image,
            apiCallTotal,
            apiCallRemaining,
            tokenIdentifier: id,
          });

          window.localStorage.setItem("tableId", existingUser);
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
