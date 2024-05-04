import { styled } from "@mui/material";
import type { Metadata } from "next";

import Main from "@/components/Main";
import { Navbar } from "@/components/nav";

export const metadata: Metadata = {
  title: "Blurple Canvas",
  description: "Generated by create next app",
};

export default async function Page() {
  return (
    <>
      <Navbar />
      <Main />
    </>
  );
}
