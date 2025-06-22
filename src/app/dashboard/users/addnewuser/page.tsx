import React from "react";
import CardButton from "@/components/global/card-button";

const AddNewUserPage = () => {
  const cardButtonItems = [
    {
      title: "Trainer",
      imageSrc: "/staff1.png",
      link: "/dashboard/users/addnewuser/trainer",
      description: "Provides training and fitness programs.",
    },
    {
      title: "Staff",
      imageSrc: "/Staff.png",
      link: "/dashboard/users/addnewuser/staff",
      description: "Handles gym operations and management.",
    },
    {
      title: "Member",
      imageSrc: "/Staff.png",
      link: "/dashboard/members/addnew",
      description: "Handles gym operations and management.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mt-20 md:mt-40 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        What type of user account would you like
      </h2>
      <p className="text-gray-500 text-lg md:text-xl mt-5 text-center">
        To start your project we need to customize your preferences.
      </p>
      <p className="text-gray-500 text-lg md:text-xl mt-5 text-center">
        Select your user type to proceed.
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

export default AddNewUserPage;
