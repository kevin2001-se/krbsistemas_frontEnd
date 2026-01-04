
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import type { IProduct } from "@/models/admin.type";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductById } from "@/api/admin/product.api.admin";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";

type DialogProductDeleteProps = {
    product: IProduct;
    setProduct: (product: IProduct | null) => void
}

export default function DialogProductDelete({ product: {_id, description}, setProduct }: DialogProductDeleteProps) {

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
            setProduct(null)
        }
    }

    const mutate = useMutation({
        mutationFn: deleteProductById,
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
                            <DialogTitle>Eliminar Producto</DialogTitle>
                            <DialogDescription>¿Seguro de eliminar el producto {description}?</DialogDescription>
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
