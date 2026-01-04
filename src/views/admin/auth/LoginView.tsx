import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginForm } from "@/models/admin.type";
import InputError from "@/components/InputError";
import { cn } from "@/lib/utils";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/admin/auth.api";
import toast from "react-hot-toast";

const initialValues: LoginForm = {
    username: "",
    password: ""
}

export default function LoginView() {

    const { state: { user } } = useUser();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        defaultValues: initialValues
    });

    if (user) {
        return <Navigate to="/admin/products" />
    }

    const mutate = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // Si todo es correcto, registrar el token y almacenar el usuario
            localStorage.setItem('token_auth', data!)
            navigate('/admin/products')
            toast.success('Bienvenido')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleLoginForm = (formData: LoginForm) => {
        mutate.mutate(formData)
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleLoginForm)}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Ingresar usuario"
                                {...register('username', {
                                    required: 'El usuario es requerido.',
                                    minLength: {
                                        value: 3,
                                        message: 'El usuario debe tener al menos 6 caracteres.'
                                    }
                                })}
                                className={
                                    cn({
                                        'border-red-700 focus-visible:ring-red-700': errors.username
                                    })
                                }
                            />
                            {errors.username && (<InputError>{errors.username.message}</InputError>)}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" placeholder="Ingresar contraseña" {...register('password', {
                                required: 'La contraseña es requerida.'
                            })} className={
                                cn({
                                    'border-red-700 focus-visible:ring-red-700': errors.password
                                })
                            } />
                            {errors.password && (<InputError>{errors.password.message}</InputError>)}
                        </div>
                        <div>
                            <Button type="submit" className="w-full">Iniciar sesión</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
