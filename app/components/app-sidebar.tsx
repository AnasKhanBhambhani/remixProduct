import { Link, useNavigate } from "@remix-run/react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../components/ui/sidebar"
import { ChartBarStacked, Home, Inbox, LogOut, Plus, Search, SquarePlus } from "lucide-react"

const items = [
    {
        title: "Dashboard",
        url: "home",
        icon: Home,
    },
    {
        title: "Products",
        url: "products",
        icon: Inbox,
    },
    {
        title: "Control Products",
        url: "productcontrol",
        icon: Plus,
    },
    {
        title: "Categories List",
        url: "categorylist",
        icon: ChartBarStacked,
    },
    {
        title: "Log Out",
        url: "/logout",
        icon: LogOut,
    },
]

export function AppSidebar() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
            });
            if (response.ok) {
                navigate('/login');
            }
        } catch (error) {
            return error
        }
    }
    return (
        <Sidebar className="bg-white">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.title == 'Log Out' ? <SidebarMenuButton onClick={handleLogout} asChild>
                                        <div className="cursor-pointer">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton> : <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
