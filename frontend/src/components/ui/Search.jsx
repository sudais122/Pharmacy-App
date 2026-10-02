import React from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = ({ placeholder = "Search..." }) => {
  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
};

export default Search;