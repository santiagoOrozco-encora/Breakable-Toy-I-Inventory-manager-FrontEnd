import { HTMLProps, forwardRef } from "react";

interface InputFieldProps extends HTMLProps<HTMLInputElement> {
  type: "number" | "text" | "date" | "decimal";
  field: string;
  placeholder: string;
  label: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ type, field, placeholder, label, ...rest }, ref) => {
    const idField = field + "input";

    switch (type) {
      case "text":
        return (
          <div className="flex flex-col gap-1 items-start w-full">
            <label
              className="font-medium text-sm text-gray-700"
              htmlFor={idField}
            >
              {label}
            </label>
            <input
              className="border-b p-2 gap-0 text-base w-full"
              type="text"
              name={idField}
              placeholder={placeholder}
              ref={ref}
              {...rest}
            />
          </div>
        );

      case "number":
        return (
          <div className="flex flex-col gap-1 items-start w-full">
            <label
              className="font-medium text-sm text-gray-700"
              htmlFor={idField}
            >
              {label}
            </label>
            <input
              className="border-b p-2 gap-0 text-base w-full"
              type="number"
              name={idField}
              placeholder={placeholder}
              ref={ref}
              {...rest}
            />
          </div>
        );

      case "date":
        return (
          <div className="flex flex-col gap-1 items-start w-full">
            <label
              className="font-medium text-sm text-gray-700"
              htmlFor={idField}
            >
              {label}
            </label>
            <input
              className="border-b p-2 gap-0 text-base w-full"
              type="date"
              name={idField}
              placeholder={placeholder}
              ref={ref}
              {...rest}
            />
          </div>
        );

      case "decimal":
        return (
          <div className="flex flex-col gap-1 items-start w-full">
            <label
              className="font-medium text-sm text-gray-700"
              htmlFor={idField}
            >
              {label}
            </label>
            <input
              className="border-b p-2 gap-0 text-base w-full"
              type="decimal"
              name={idField}
              placeholder={placeholder}
              ref={ref}
              {...rest}
            />
          </div>
        );

      default:
        return null;
    }
  }
);

export default InputField;
