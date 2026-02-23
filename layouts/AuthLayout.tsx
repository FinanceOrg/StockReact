type AuthLayoutProps = {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="bg-linear-to-b from-[#6756FF] to-[#9DE5FF] h-screen flex items-center justify-center">
            {children}
        </div>
    )
}