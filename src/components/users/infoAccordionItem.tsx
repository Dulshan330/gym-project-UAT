import React, { ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string | boolean | number | string[] | Date | null | undefined;
}

interface InfoAccordionItemProps {
  value: string;
  title: string;
  items?: InfoItemProps[];
  componet?: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  const formattedValue = Array.isArray(value)
    ? value.join(", ").replace(/-/g, " ")
    : value instanceof Date
    ? value.toLocaleString()
    : value;
  return (
    <>
      {value && (
        <div className="flex flex-row items-center space-y-1 md:space-y-0 space-x-3 text-gray-600">
          <div className="flex flex-row items-center space-x-2">
            {icon}
            <span className="font-medium text-sm md:text-base capitalize">
              {label}:
            </span>
          </div>
          <span className="text-sm md:text-base">
            {formattedValue || "N/A"}
          </span>
        </div>
      )}
    </>
  );
}

const InfoAccordionItem: React.FC<InfoAccordionItemProps> = ({
  items,
  title,
  value,
  componet,
}) => {
  return (
    <AccordionItem
      value={value}
      className="bg-gray-50 px-4 md:px-6 py-3 rounded-lg w-full"
    >
      <AccordionTrigger className="text-base md:text-lg max-md:text-base font-semibold hover:no-underline px-2">
        {title}
      </AccordionTrigger>
      <AccordionContent className="space-y-2 text-sm md:text-base px-2">
        {componet
          ? componet
          : items?.map((item, index) => (
              <InfoItem
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default InfoAccordionItem;
