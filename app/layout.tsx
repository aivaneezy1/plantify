"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ConvexClientProvider } from "./ConvexClientProvider";
import DataContextProvider from "./Context/Provider";
import { ClerkProvider, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import Loading from "./utils/Loading";
import { dark } from "@clerk/themes";
import { CrispProvider } from "./components/Crisp-Provder";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
      <CrispProvider/>
        <body>
          <ClerkLoading>
            <div className="flex justify-center items-center h-screen ">
              <Loading />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <DataContextProvider>
              <Navbar />

              <ConvexClientProvider>{children}</ConvexClientProvider>
            </DataContextProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
