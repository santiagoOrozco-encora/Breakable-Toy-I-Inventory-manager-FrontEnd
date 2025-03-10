import { FunctionComponent } from "react";
import SearchBox from "../molecules/SearchBox";

interface HeaderProps{}
const Header:FunctionComponent<HeaderProps> = ()=>{
    return (
      <section className="w-full m-10 flex justify-center">
        <SearchBox />
      </section>
    );
}

export default Header;