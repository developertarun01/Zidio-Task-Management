import React from "react";
import clsx from "clsx";
import "./Textbox.css"


const Textbox = React.forwardRef(
  ({ type, placeholder, label,value, onChange, className, register, name, error }, ref) => {
    return (
      <div className='relative w-full gap-1'>
        {label && (
          <label htmlFor={name}  className='label-login w-full text-white '>
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            id={name}
            onChange={onChange}
            ref={ref}
            {...register}
            aria-invalid={error ? "true" : "false"}
            className={clsx(
              "bg-transparent m-2 px-3 py-4  rounded-md border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base ring-blue-600",
              className
            )}
          />
        </div>
        {error && (
          <span className='text-xs text-[#f64949fe] mt-0.5 '>{error}</span>
        )}
      </div>
    );
  }
);
export default Textbox;