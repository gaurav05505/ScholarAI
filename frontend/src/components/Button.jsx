import React from "react";

const Button = ({
  text,
  icon: Icon,
  showIcon = true,
  active = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        h-14
        flex
        items-center
        gap-3
        px-4
        rounded-2xl
        text-[16px]
        text-[#1E1E1E]
        transition-all
        duration-200

        ${
          active
            ? "bg-white shadow-sm"
            : "bg-transparent hover:bg-white"
        }

        active:scale-[0.98]
        ${className}
      `}
    >
      {showIcon && Icon && (
        <Icon size={20} className="text-[#1E1E1E] shrink-0" />
      )}

      <span>{text}</span>
    </button>
  );
};

export default Button;