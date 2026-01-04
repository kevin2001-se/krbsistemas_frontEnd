import { updatedUser } from "@/api/admin/user.admin";
import type { IUser, IUserFormEdit } from "@/models/admin.type"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../InputError";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

type DialogUserEditProps = {
    user: IUser;
    setUser: (user: IUser | null) => void
}

export default function DialogUserEdit({user, setUser}: DialogUserEditProps) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""
    const form = useForm<IUserFormEdit>({
        defaultValues: {
            username: user.username || "",
            email: user.email || "",
            isActive: user.isActive,
        }
    });
    const { register, handleSubmit, formState: { errors }, control } = form;

    const queryClient = useQueryClient();

    const modalEdit = searchParams.get('modal') === 'modalEdit'

    const hancleChangeDialog = () => {
        if (modalEdit) {
            const params = new URLSearchParams(searchParams);
            params.delete("modal");
            setSearchParams(params);
            setUser(null)
        }
    }

    const mutate = useMutation({
        mutationFn: updatedUser,
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["user", page, searchQuery] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleFormUser = async (formData: IUserFormEdit) => {
        mutate.mutate({
            _id: user._id,
            formData
        })
    }

    return (
        <Dialog open={modalEdit} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormUser)}>
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
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
                                <Label htmlFor="isActive">Estado</Label>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <Switch
                                        id="isActive"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
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
