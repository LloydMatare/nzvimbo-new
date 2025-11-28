import React from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Nzvimbo Dashboard",
  description: "Nzvimbo Dashboard",
};

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="">
        {children}
        <p className="">Footer</p>
      </main>
    </div>
  );
}

export default DashboardLayout;
