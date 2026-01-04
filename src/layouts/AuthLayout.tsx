
import { UserProvider } from "@/context/UserProvider";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

export default function AuthLayout() {
    return (
        <UserProvider>
            <div className="flex justify-center items-center h-screen px-5">
                <Outlet />
            </div>

            <Toaster />
        </UserProvider>
    )
}
