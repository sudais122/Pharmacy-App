import React, { useState } from "react";

const DropDownmenu = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const [internalValue, setInternalValue] = useState("");

  // If the parent passes `value`, use it. Otherwise keep our own state.
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="h-11 w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropDownmenu;