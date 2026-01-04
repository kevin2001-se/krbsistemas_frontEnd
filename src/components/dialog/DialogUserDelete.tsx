import type { IUser } from "@/models/admin.type";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserById } from "@/api/admin/user.admin";
import toast from "react-hot-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type DialogUserDeleteProps = {
    user: IUser;
    setUser: (user: IUser | null) => void
}

export default function DialogUserDelete({user: { _id, username }, setUser}: DialogUserDeleteProps) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""

    const modalDelete = searchParams.get('modal') === 'modalDelete'

    const form = useForm<{_id: string}>({
        defaultValues: {
            _id: _id
        }
    });
    const { register, handleSubmit } = form;

    const queryClient = useQueryClient();

    const hancleChangeDialog = () => {
        if (modalDelete) {
            const params = new URLSearchParams(searchParams);
            params.delete("modal");
            setSearchParams(params);
            setUser(null)
        }
    }

    const mutate = useMutation({
        mutationFn: deleteUserById,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["service", page, searchQuery] })
        }
    })

    const handleFormProduct = () => {
        mutate.mutate(_id)
    }

    return (
        <Dialog open={modalDelete} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormProduct)}>
                        <DialogHeader>
                            <DialogTitle>Eliminar Usuario</DialogTitle>
                            <DialogDescription>¿Seguro de eliminar el usuario {username}?</DialogDescription>
                        </DialogHeader>

                        <Input type="hidden" id="_id" {...register('_id')} />

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            {
                                mutate.isPending ? 
                                (<Button type="submit" disabled> <Spinner className="mr-2" /> Cargando</Button>) :
                                (<Button type="submit">Eliminar</Button>)
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
