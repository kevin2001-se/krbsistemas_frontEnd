import { createProduct } from "@/api/admin/product.api.admin";
import type { IProductForm } from "@/models/admin.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../InputError";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function DialogProductCreate() {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""
    const form = useForm<IProductForm>({
        defaultValues: {
            description: "",
            price: 0,
            stock: 0,
            image: null,
        }
    });
    const { register, handleSubmit, formState: { errors } } = form;

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
        mutationFn: createProduct,
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["product", page, searchQuery] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleFormProduct = async (data: IProductForm) => {
        const formData = new FormData();
        formData.append("description", data.description)
        formData.append("price", data.price.toString())
        formData.append("stock", data.stock.toString())
        formData.append("image", data.image ? data.image[0] : "");
        mutate.mutate(formData)
    }

    return (
        <Dialog open={modalCreate} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormProduct)}>
                        <DialogHeader>
                            <DialogTitle>Registrar Producto</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <Label htmlFor="description">Descripción</Label>
                                <Input type="text" id="description" placeholder="Descripción" 
                                    {...register('description', {
                                        required: 'La descripción es requerida.'
                                    })}
                                />
                                {errors.description && (<InputError>{errors.description.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="price">Precio</Label>
                                <Input type="number" id="price" placeholder="Precio" step='any'
                                    {...register('price', {
                                        required: 'El precio es requerida.',
                                        min: {
                                            value: 1,
                                            message: "El precio no puede ser menor a 0."
                                        }
                                    })}
                                />
                                {errors.price && (<InputError>{errors.price.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="stock">Stock</Label>
                                <Input type="number" id="stock" placeholder="Stock"
                                    {...register('stock', {
                                        required: 'El stock es requerida.',
                                        min: {
                                            value: 1,
                                            message: "El stock no puede ser menor a 0."
                                        }
                                    })}
                                />
                                {errors.stock && (<InputError>{errors.stock.message}</InputError>)}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="image">Imagen</Label>
                                <Input type="file" id="image" placeholder="image" 
                                    {...register('image')}
                                />
                                {errors.image && (<InputError>{errors.image.message}</InputError>)}
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
