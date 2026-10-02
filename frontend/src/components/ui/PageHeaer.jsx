import React from "react";

const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {title}
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;