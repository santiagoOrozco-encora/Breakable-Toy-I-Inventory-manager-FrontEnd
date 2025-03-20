import { HTMLProps, forwardRef } from "react";

interface SelectFieldProps extends HTMLProps<HTMLSelectElement> {
  optionName: string;
  options?: string[];
  label: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ optionName, options, children, label, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 items-start w-full">
        <label
          className="font-medium text-sm text-gray-700"
          htmlFor={optionName + "_select"}
        >
          {label}
        </label>
        <select
          className="w-full border-b p-2 gap-0 text-base text-gray-500"
          id={optionName + "_select"}
          ref={ref}
          {...rest}
        >
          <option value="" key="default">Select an option</option>
          {options ? (
            options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))
          ) : (
            <>
              <option key={"default"} value={3}>
                {"All"}
              </option>
              <option key={"1"} value={1}>
                {"In stock"}
              </option>
              <option key={"2"} value={2}>
                {"Out of stock"}
              </option>
            </>
          )}
        </select>
      </div>
    );
  }
);

export default SelectField;
