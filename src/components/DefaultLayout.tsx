import React from "react";
import HeaderApp from "./HeaderApp";

export const DefaultLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <HeaderApp />
      {children}
    </>
  );
};
