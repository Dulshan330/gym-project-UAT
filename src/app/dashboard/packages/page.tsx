import CardButton from "@/components/global/card-button";
import React from "react";

const Packages = () => {
  const cardButtonItems = [
    {
      title: "All Packages",
      imageSrc: "/package.png",
      link: "/dashboard/packages/all-packages",
    },
    {
      title: "Packages Type Management ",
      imageSrc: "/package.png",
      link: "/dashboard/packages/package-type",
    },
  ];
  return (
    <div className="p-4 w-full">
      <p className="text-2xl font-semibold">Package Management</p>
      <div className="flex flex-wrap gap-8 mt-10 mx-auto">
        {cardButtonItems.map((item, index) => (
          <CardButton
            key={index}
            title={item.title}
            imageSrc={item.imageSrc}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Packages;
