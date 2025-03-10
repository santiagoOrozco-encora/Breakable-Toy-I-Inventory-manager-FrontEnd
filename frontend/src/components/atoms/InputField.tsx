import { FunctionComponent, HTMLAttributes } from "react";

interface InputFieldProps extends HTMLAttributes<InputFieldProps>{
    type: 'number' | 'text',
    field: string,
    placeholder:string,
    label:string
}

const InputField: FunctionComponent<InputFieldProps> =({type,field,placeholder,label})=>{
    const idField = field + 'input';

    switch (type) {
        case 'text':
            return(
                <div className="flex flex-col gap-1 items-start w-full">
                <label className="font-medium text-sm text-gray-700" htmlFor={idField}>{label}</label>
                <input className="border-b p-2 gap-0 text-base w-full" type="text" name={idField} placeholder={placeholder}/>
                </div>
            )
            break;
    
        case "number":
            return(
                <div className="flex flex-col gap-1 items-start w-full">
                <label className="font-medium text-sm text-gray-700" htmlFor={idField}>{label}</label>
                <input className="border-b p-2 gap-0 text-base w-full" type="number" name={idField} placeholder={placeholder}/>
                </div>
            )
            break;
    }
    
}

export default InputField;