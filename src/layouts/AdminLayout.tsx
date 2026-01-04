import AppSidebar from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserProvider";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
    return (
        <UserProvider>
            <SidebarProvider>
                
                <AppSidebar />

                <SidebarInset>
                    <SidebarTrigger className="ml-2" />
                    <Separator
                        className="mr-2"
                    />
                    <div className="p-4">
                        <Outlet />
                    </div>
                </SidebarInset>

            </SidebarProvider>

            <Toaster />
        </UserProvider>
    )
}
