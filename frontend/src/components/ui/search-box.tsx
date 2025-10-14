import React, { useState } from "react";
import type { ChangeEvent } from "react";

const SearchBox: React.FC = () => {
  const [q, setQ] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value);

  return (
    <form
      action="/search"
      className="flex items-center w-full max-w-2xl mx-auto"
      role="search"
    >
      <input
        name="q"
        value={q}
        onChange={onChange}
        className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Tìm kiếm sản phẩm..."
        maxLength={100}
        aria-label="Tìm kiếm sản phẩm"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700 transition-colors"
      >
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchBox;
