import NotificationLogo from '@/icons/notification.svg'

export default function Menu() {
    return(
        <div className="h-[50px] flex items-center justify-between px-4">
            <div className="text-white font-bold text-lg cursor-default select-none" style={{ textShadow: "2px 2px 4px rgba(255,255,255,0.5)"}}>
                STOCK
            </div>
            <div className="text-white text-lg font-bold">Dashboard</div>
            <div className="relative">
                <div className="size-2 bg-red-500 absolute right-1 top-0.5 rounded-full"></div>
                <NotificationLogo className="size-8 text-gray-500"/>
            </div>
        </div>
    )
}