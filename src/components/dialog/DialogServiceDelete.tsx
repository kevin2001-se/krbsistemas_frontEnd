import { deleteServiceById } from "@/api/admin/services.api.admin";
import type { IService } from "@/models/admin.type"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";

type DialogServiceDeleteProps = {
    service: IService;
    setService: (service: IService | null) => void;
}

export default function DialogServiceDelete({ service: {_id, title}, setService }: DialogServiceDeleteProps) {

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
            setService(null)
        }
    }

    const mutate = useMutation({
        mutationFn: deleteServiceById,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["product", page, searchQuery] })
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
                            <DialogTitle>Eliminar Servicio</DialogTitle>
                            <DialogDescription>¿Seguro de eliminar el servicio {title}?</DialogDescription>
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
