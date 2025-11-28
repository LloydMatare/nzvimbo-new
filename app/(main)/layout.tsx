import Footer from "@/components/main/footer";
import Navbar from "@/components/main/navbar";
import React from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Nzvimbo",
  description: "Nzvimbo",
};

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
