import { FunctionComponent, HTMLAttributes } from "react";

interface CheckboxProps extends HTMLAttributes<HTMLInputElement>{

}

const Checkbox:FunctionComponent<CheckboxProps> = ({})=>{
    return(
        <input type="checkbox"/>
    )
}

export default Checkbox;