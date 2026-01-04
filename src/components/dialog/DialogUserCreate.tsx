import type { IUserFormCreate } from "@/models/admin.type"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../InputError";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useForm } from "react-hook-form";
import { createUser } from "@/api/admin/user.admin";

export default function DialogUserCreate() {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""
    const form = useForm<IUserFormCreate>({
        defaultValues: {
            username: "",
            email: "",
            isActive: true,
            password: "",
            password_confirm: ""
        }
    });
    const { register, handleSubmit, formState: { errors }, watch } = form;

    const password = watch('password')

    const queryClient = useQueryClient();

    const modalCreate = searchParams.get('modal') === 'modalCreate'

    const hancleChangeDialog = () => {
        if (modalCreate) {
            const params = new URLSearchParams(searchParams);
            params.delete("modal");
            setSearchParams(params);
        }
    }

    const mutate = useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["user", page, searchQuery] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleFormUser = async (formData: IUserFormCreate) => {
        mutate.mutate(formData)
    }

    return (
        <Dialog open={modalCreate} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormUser)}>
                        <DialogHeader>
                            <DialogTitle>Registrar Usuario</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Usuario</Label>
                                <Input type="text" id="username" placeholder="Usuario"
                                    {...register('username', {
                                        required: 'El Usuario es requerido.',
                                        minLength: {
                                            value: 5,
                                            message: "El usuario debe tener por lo menos 5 caracteres."
                                        }
                                    })}
                                />
                                {errors.username && (<InputError>{errors.username.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Correo electronico</Label>
                                <Input type="email" id="email" placeholder="Descripción" 
                                    {...register('email', {
                                        required: 'El correo electronic es requerido.',
                                        pattern: {
                                            value:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "El correo es incorrrecto."
                                        }
                                    })}
                                />
                                {errors.email && (<InputError>{errors.email.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input type="password" id="password" placeholder="Contraseña"
                                    {...register('password', {
                                        required: 'El Password es requerido.',
                                        minLength: {
                                            value: 8,
                                            message: "La contraseña debe tener por lo menos 8 caracteres."
                                        }
                                    })}
                                />
                                {errors.password && (<InputError>{errors.password.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password_confirm">Confirmar Contraseña</Label>
                                <Input type="password" id="password_confirm" placeholder="Contraseña"
                                    {...register('password_confirm', {
                                        validate: (value) => value === password || 'Las contraseñas no son iguales.'
                                    })}
                                />
                                {errors.password_confirm && (<InputError>{errors.password_confirm.message}</InputError>)}
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            {
                                mutate.isPending ? 
                                (<Button type="submit" disabled> <Spinner className="mr-2" /> Cargando</Button>) :
                                (<Button type="submit">Guardar</Button>)
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
