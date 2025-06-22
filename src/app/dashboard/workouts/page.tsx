import CardButton from "@/components/global/card-button";
import React from "react";

const WorkoutsPage = () => {
  const cardButtonItems = [
    {
      title: "Assign Schedule",
      imageSrc: "/trainer.png",
      link: "/dashboard/workouts/all-schedules",
    },
    {
      title: "View Schedule",
      imageSrc: "/trainer.png",
      link: "/dashboard/workouts/view-schedules",
    },
    {
      title: "Workouts",
      imageSrc: "/Staff.png",
      link: "/dashboard/workouts/exercises",
    },
    {
      title: "Workout Category",
      imageSrc: "/Staff.png",
      link: "/dashboard/workouts/exercises-type",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mt-20 md:mt-40 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        Workout Management
      </h2>
      <p className="text-gray-500 text-lg md:text-xl mt-5 text-center">
        Select an option below to manage workout categories, workouts and
        schedule.
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

export default WorkoutsPage;
