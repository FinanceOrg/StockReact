import HomeLogo from "@/icons/home.svg"
import DiagramLogo from "@/icons/diagram.svg"
import MenuElement from "@/components/MenuElement";

export default function Menu() {
    return(
        <div className="bg-[#17253E] h-[50px] sm:h-auto sm:w-[90px] flex sm:flex-col items-center">
            <MenuElement name="Home" icon={HomeLogo}/>
            <MenuElement name="Statistics" icon={DiagramLogo}/>
        </div>
    )
}