import CardButton from "@/components/global/card-button";
import React from "react";

const MemberAddNewPage = () => {
  const cardButtonItems = [
    {
      title: "Add New Member",
      imageSrc: "/staff1.png",
      link: "/dashboard/members/addnew/medical",
      description: "Register new gym members and create their profiles in the system.",
    },
    {
      title: "Assign Trainer",
      imageSrc: "/Staff.png",
      link: "/dashboard/members/addnew/trainer-selection",
      description: "Connect members with certified trainers for personalized fitness guidance.",
    },
    {
      title: "Renew Package",
      imageSrc: "/Staff.png",
      link: "/dashboard/members/addnew/package-selection",
      description: "Select and assign the perfect membership plan to your gym members.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mt-20 md:mt-40 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center capitalize">
        Member management setup
      </h2>
      <p className="text-gray-500 text-lg md:text-xl mt-5 text-center">
        Select an option below to manage your gym members, trainers, or membership packages.
      </p>

      {/* Grid Layout for Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 max-w-6xl">
        {cardButtonItems.map((item, index) => (
          <CardButton
            key={index}
            title={item.title}
            imageSrc={item.imageSrc}
            link={item.link}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberAddNewPage;
