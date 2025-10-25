import NotificationLogo from '@/icons/notification.svg'

type MenuProps = {
    title: string
}

export default function Menu({ title }: MenuProps) {
    return(
        <div className="h-[60px] flex items-center justify-between px-4">
            <div className="text-white font-bold text-lg cursor-default select-none" style={{ textShadow: "2px 2px 4px rgba(255,255,255,0.5)"}}>
                STOCK
            </div>
            <div className="text-white text-xl font-bold">{title}</div>
            <div className="relative">
                <div className="size-2 bg-red-500 absolute right-1 top-0.5 rounded-full"></div>
                <NotificationLogo className="size-8 text-gray-500"/>
            </div>
        </div>
    )
}