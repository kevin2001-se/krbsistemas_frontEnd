import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import LoginView from './views/admin/auth/LoginView'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'
import ProductView from './views/admin/views/ProductView'
import UserView from './views/admin/views/UserView'
import ServicesView from './views/admin/views/ServicesView'
import BannerView from './views/admin/views/BannerView'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />

                <Route path="/admin">
                    <Route path="login" element={<AuthLayout />}>
                        <Route index element={<LoginView />} />
                    </Route>

                    <Route element={<AdminLayout />}>
                        <Route path="products" element={<ProductView />} />
                        <Route path="users" element={<UserView />} />
                        <Route path="services" element={<ServicesView />} />
                        <Route path="banners" element={<BannerView />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
