import SideNav from "../ui/dashboard/sidenav"

export default function DashLayout({ children }: {
    children: React.ReactNode
}) {


    return (
        <div className="flex">
            <SideNav />
            <div className="p-3 m-2 border-spacing-1 border-red-300 ">
                {children}
            </div>
        </div>

    )
}