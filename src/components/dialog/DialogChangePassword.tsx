import type { IUserChangePassword } from "@/models/admin.type";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../InputError";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";
import { changePassword } from "@/api/admin/user.admin";

export default function DialogChangePassword({dialog, setDialog}:{dialog: boolean, setDialog: (dialog: boolean) => void}) {

    const form = useForm<IUserChangePassword>({
        defaultValues: {
            old_password: "",
            password: "",
            password_confirm: ""
        }
    });
    const { register, handleSubmit, formState: { errors }, watch } = form;

    const password = watch('password')

    const hancleChangeDialog = () => {
        if (dialog) {
            setDialog(!dialog);
        }
    }

    const mutate = useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    
    const handleFormUser = async (formData: IUserChangePassword) => {
        mutate.mutate(formData)
    }

    return (
        <Dialog open={dialog} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormUser)}>
                        <DialogHeader>
                            <DialogTitle>Actualizar contraseña</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <Label htmlFor="old_password">Contraseña Actual</Label>
                                <Input type="password" id="old_password" placeholder="Contraseña Anterior"
                                    {...register('old_password', {
                                        required: 'El contraseña es requerido.'
                                    })}
                                />
                                {errors.old_password && (<InputError>{errors.old_password.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Nueva Contraseña</Label>
                                <Input type="password" id="password" placeholder="Nueva Contraseña"
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
