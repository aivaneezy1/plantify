"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import Loading from "./utils/Loading";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from "@clerk/nextjs";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
    <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
    <AuthLoading>
    <Loading/>
    </AuthLoading>
      <Authenticated> {children}</Authenticated>
      <Unauthenticated>{children}</Unauthenticated>
      </ConvexProviderWithClerk>
    </ConvexProvider>
  );
}
