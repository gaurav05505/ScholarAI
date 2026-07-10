import React from "react";
import { Share2, SendHorizontal } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="w-[90%] sm:w-4/5 flex items-center gap-2 sm:gap-3 lg:gap-4">
      {/* Search Input */}
      <div className="flex-1 h-[38px] sm:h-[44px] lg:h-[51px] bg-white/90 rounded-xl lg:rounded-2xl flex items-center px-3 sm:px-4 lg:px-5 shadow-lg">
        {/* Left Icon */}
        <Share2
          size={16}
          className="text-neutral-500 shrink-0 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5"
          strokeWidth={1.8}
        />

        {/* Input */}
        <input
          type="text"
          placeholder="i want to learn about web dev"
          className="flex-1 bg-transparent px-2 sm:px-3 lg:px-4 text-[12px] sm:text-[13px] lg:text-[15px] text-neutral-900 placeholder:text-neutral-500 outline-none min-w-0"
        />
      </div>

      {/* Send Button */}
      <button
        className="h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] lg:h-[51px] lg:w-[51px] rounded-xl lg:rounded-2xl bg-[#FF7A45] hover:bg-[#ff6b32] transition-all duration-200 flex items-center justify-center shrink-0"
      >
        <SendHorizontal
          size={16}
          className="text-white sm:w-[18px] sm:h-[18px] lg:w-[22px] lg:h-[22px]"
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default Searchbar;