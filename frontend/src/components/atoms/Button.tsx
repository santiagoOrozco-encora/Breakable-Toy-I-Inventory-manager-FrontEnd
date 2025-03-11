import { FunctionComponent, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement>{
    variant: 'primary'|'secondary'|'alt',
}

const BTNVARIANT ={
    primary: 'rounded-md p-2 bg-blue-300 text-white transition-all hover:bg-transparent hover:text-blue-300  ',
    secondary: ' h-auto border p-2 border-blue-300 text-blue-300 rounded-md transition-all hover:font-semibold hover:bg-blue-300 hover:text-white ',
    alt: 'h-fit,rounded-md, border-gray-300 tansition-all hover:font-semibold '
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  variant,
  ...rest
}) => {
  const btnStyle = BTNVARIANT[variant];

  return (
    <button
      disabled
      className={twMerge("hover:cursor-pointer", btnStyle)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

