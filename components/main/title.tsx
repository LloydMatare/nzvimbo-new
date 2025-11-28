import Link from "next/link";
import React from "react";

function Title() {
  return (
    <Link href={"/"} className="text-lg font-bold">
      Nzvimbo<span className="text-red-800 text-4xl">.</span>
    </Link>
  );
}

export default Title;
