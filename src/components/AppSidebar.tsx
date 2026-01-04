import { HandPlatter, LaptopMinimal, Proportions, User } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Link, Navigate, useLocation } from "react-router-dom";
import { NavUser } from "./NavUser";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserProvider";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/admin/auth.api";

const menus = [
    {
        title: "Productos",
        url: "/admin/products",
        icon: LaptopMinimal,
    },
    {
        title: "Banner",
        url: "/admin/banners",
        icon: Proportions,
    },
    {
        title: "Servicios",
        url: "/admin/services",
        icon: HandPlatter,
    },
    {
        title: "Usuarios",
        url: "/admin/users",
        icon: User,
    }
]

export default function AppSidebar() {

    const { state: { user }, dispatch } = useUser();

    const location = useLocation();
    const rutaActual = location.pathname;

    if (!localStorage.getItem("token_auth")) {
        dispatch({ type: 'logout' });
        return <Navigate to="/admin/login" replace />;
    }

    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        retry: 2
    });

    useEffect(() => {
        if (data) {
            dispatch({ type: 'Login', payload: data });
        }
    }, [data, dispatch]);

    if (isLoading) {
        return null; // o un spinner
    }

    if (user) return (
        <Sidebar collapsible="icon">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menus.map((menu) => (
                                <SidebarMenuItem key={menu.title}>
                                    <SidebarMenuButton asChild isActive={rutaActual === menu.url} 
                                        className={cn(
                                            'transition-colors',
                                            rutaActual === menu.url && '!bg-black !text-white'
                                        )}>
                                        <Link to={menu.url}>
                                            <menu.icon />
                                            <span>{menu.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </ SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: user?.username!,
                    email: user?.email!,
                    avatar: ""
                }} />
            </SidebarFooter>
        </Sidebar>
    )
}
