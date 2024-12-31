import { useNavigate } from "@remix-run/react"
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
import { Home, Inbox, LogOut, Search } from "lucide-react"
interface AppSidebarProps {
    status: string;
}
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
        icon: Search,
        adminOnly: true,
    },
    {
        title: "Log Out",
        url: "/logout",
        icon: LogOut,
    },
]

export function AppSidebar({ status }: AppSidebarProps) {
    const filteredItems = items.filter(
        (item) => !item.adminOnly || status === "admin"
    );
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
            });
            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{status === 'admin' ? 'Welcome Admin' : 'Welcome User'}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.title == 'Log Out' ? <SidebarMenuButton onClick={handleLogout} asChild>
                                        <div className="cursor-pointer">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton> : <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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
