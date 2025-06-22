import Image from "next/image";
import React from "react";
import ProtectedLink from "../protected-link/protectedLink";

interface CardButtonProps {
  title: string;
  imageSrc: string;
  link: string;
  description?: string;
}

const CardButton: React.FC<CardButtonProps> = ({
  title,
  imageSrc,
  link,
  description,
}) => {
  return (
    <ProtectedLink href={link} className="flex">
      <div className="bg-white p-6 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition w-fit">
        <Image
          src={imageSrc}
          width={80}
          height={80}
          alt="CardButton"
          className="w-20 md:w-24 mx-auto"
        />
        <h3 className="font-semibold text-lg mt-5 text-center w-52">{title}</h3>
        {description && (
          <p className="text-gray-500 text-sm md:text-m mt-5 text-center">
            {description}
          </p>
        )}
      </div>
    </ProtectedLink>
  );
};

export default CardButton;
