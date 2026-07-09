import React from "react";
import { Share2, SendHorizontal } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="w-4/5 flex items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 h-[51px]  bg-white/90 rounded-2xl flex items-center px-5 shadow-lg">
        {/* Left Icon */}
        <Share2
          size={20}
          className="text-neutral-500 shrink-0"
          strokeWidth={1.8}
        />

        {/* Input */}
        <input
          type="text"
          placeholder="i want to learn about web dev"
          className="flex-1 bg-transparent px-4 text-[15px] text-neutral-900 placeholder:text-neutral-500 outline-none"
        />
      </div>

      {/* Send Button */}
      <button
        className="h-[51px] w-[51px] rounded-2xl bg-[#FF7A45] hover:bg-[#ff6b32] transition-all duration-200 flex items-center justify-center"
      >
        <SendHorizontal
          size={22}
          className="text-white"
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default Searchbar;