import { createService } from "@/api/admin/services.api.admin";
import type { IServiceForm } from "@/models/admin.type";
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

export default function DialogServiceCreate() {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""
    const form = useForm<IServiceForm>({
        defaultValues: {
            title: "",
            description: "",
            price: 0,
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
        mutationFn: createService,
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["service", page, searchQuery] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleFormService = async (data: IServiceForm) => {
        const formData = new FormData();
        formData.append("title", data.title)
        formData.append("description", data.description)
        if (data.price) {
            formData.append("price", data.price.toString())
        }
        formData.append("image", data.image ? data.image[0] : "");
        mutate.mutate(formData)
    }

    return (
        <Dialog open={modalCreate} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormService)}>
                        <DialogHeader>
                            <DialogTitle>Registrar Servicio</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Titulo</Label>
                                <Input type="text" id="title" placeholder="Titulo"
                                    {...register('title', {
                                        required: 'El Titulo es requerida.'
                                    })}
                                />
                                {errors.title && (<InputError>{errors.title.message}</InputError>)}
                            </div>
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
