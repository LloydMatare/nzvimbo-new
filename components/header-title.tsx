import React from "react";

function HeaderTitle({ title }: { title: string }) {
  return (
    <div className="mt-12 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        {title}
        <span className="text-primary text-4xl">.</span>
      </h2>
    </div>
  );
}

export default HeaderTitle;
