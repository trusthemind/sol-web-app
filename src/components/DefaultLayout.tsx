import React from "react";
import { Toaster } from "./ui/sonner";
import { AuthProvider } from "../shared/stores/context/AuthContext";
import { HeaderApp } from "./header/HeaderApp";

export const DefaultLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <AuthProvider>
      <HeaderApp />
        <main>{children}</main>
      </AuthProvider>
      <Toaster position="top-right" expand={false} />
    </>
  );
};
