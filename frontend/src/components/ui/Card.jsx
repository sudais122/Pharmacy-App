import React from "react";

const Card = ({
  title,
  value,
  icon: Icon,
  iconBg = "bg-green-100",
  iconColor = "text-green-600",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-5
        hover:shadow-md transition-shadow duration-200
        ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h1>
        </div>

        {Icon && (
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;