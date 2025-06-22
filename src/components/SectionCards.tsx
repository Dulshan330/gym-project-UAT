"use client";
import { getSectionCardInformation } from "@/app/actions/dashboardManagement";
import { StatValues } from "@/types";
import { UserCheck, UserCog, UserX } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loader from "./loader";

const SectionCards = () => {
  const [count, setCount] = useState<StatValues>({
    activeUsers: 0,
    expiredUser: 0,
    expireSoon: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserCount = async () => {
      try {
        setLoading(true);
        const res = await getSectionCardInformation();
        console.log(res);
        
        if (res) {
          setCount(res as StatValues);
        } else {
          setCount({
            activeUsers: 0,
            expiredUser: 0,
            expireSoon: 0,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getUserCount();
  }, []);

  const stats = [
    {
      title: "Active Users",
      count: count.activeUsers,
      icon: <UserCheck />,
      borderColor: "border-green-500",
      bgColor: "bg-gradient-to-r from-green-400 to-green-900",
    },
    {
      title: "Expire Soon",
      count: count.expireSoon,
      icon: <UserCog />,
      borderColor: "border-amber-500",
      bgColor: "bg-gradient-to-r from-amber-400 to-amber-900",
    },
    {
      title: "Expired Users",
      count: count.expiredUser,
      icon: <UserX />,
      borderColor: "border-red-500",
      bgColor: "bg-gradient-to-r from-red-400 to-red-900",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex flex-wrap justify-between p-2 gap-2">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex justify-center items-center border ${stat.bgColor} ${stat.borderColor} rounded-lg w-80 h-24 text-white`}
        >
          <div className="flex gap-4 justify-center items-center">
            {React.cloneElement(stat.icon, { className: "size-10" })}
            <div>
              <p className="text-2xl">{stat.count}</p>
              <p className="capitalize">{stat.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionCards;
