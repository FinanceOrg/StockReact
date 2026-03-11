import Logo from "@/components/Logo";
import NotificationLogo from "@/icons/notification.svg";


type MenuProps = {
    title: string
}

export default function Menu({ title }: MenuProps) {
    return(
        <div className="h-[65px] flex items-center justify-between px-4">
            <Logo size='size-8' href="/" />
            <div className="text-white text-xl font-bold">{title}</div>
            <div className="relative cursor-pointer">
                <div className="size-2 bg-red-500 absolute right-1 top-0.5 rounded-full"></div>
                <NotificationLogo className="size-8 text-gray-500"/>
            </div>
        </div>
    );
}