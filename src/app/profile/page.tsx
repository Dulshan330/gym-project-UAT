"use client";
import CardButton from "@/components/global/card-button";
import { userAtom } from "@/store/atom";
import { useAtom } from "jotai";
import React from "react";

const ProfilePage = () => {
  const [user] = useAtom(userAtom);
  const cardButtonItems = [
    {
      title: "View Schedule",
      imageSrc: "/staff1.png",
      link: "/profile/schedule",
    },
    {
      title: "View Personal Information",
      imageSrc: "/Staff.png",
      link: "/profile/view",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mt-20 md:mt-40 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center capitalize">
        Welcome back, {user.username}
      </h2>
      <p className="text-gray-500 text-lg md:text-xl mt-5 text-center">
        Select an option below to view your workout schedule, or personal
        information packages.
      </p>

      {/* Grid Layout for Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 max-w-6xl">
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

export default ProfilePage;
