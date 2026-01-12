"use client";
// import { ThemeProvider } from "@/components/Theme/Themeprovider";
// import ProgressBar from "@/components/ui/ProgressBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
// import ProgressBar from "./ProgressBar";
import { Toaster } from "sonner";
import CategoryProvider from "./CategoryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ProgressBar /> */}
      <Toaster richColors position="top-right" />
      <CategoryProvider />
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="light"
        // enableSystem
        disableTransitionOnChange
      > */}
      {children}
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
