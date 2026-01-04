import { updatedService } from "@/api/admin/services.api.admin";
import type { IService, IServiceForm } from "@/models/admin.type";
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

type DialogServiceEditProps = {
    service: IService;
    setService: (service: IService | null) => void;
}

export default function DialogServiceEdit({ service, setService }: DialogServiceEditProps) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""
    const form = useForm<IServiceForm>({
        defaultValues: {
            title: service.title || "",
            description: service.description || "",
            price: service.price || 0,
            image: null,
        }
    });
    const { register, handleSubmit, formState: { errors } } = form;

    const queryClient = useQueryClient();

    const modalEdit = searchParams.get('modal') === 'modalEdit'

    const hancleChangeDialog = () => {
        if (modalEdit) {
            const params = new URLSearchParams(searchParams);
            params.delete("modal");
            setSearchParams(params);
            setService(null)
        }
    }

    const mutate = useMutation({
        mutationFn: updatedService,
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
        mutate.mutate({
            _id: service._id,
            formData
        })
    }

    return (
        <Dialog open={modalEdit} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormService)}>
                        <DialogHeader>
                            <DialogTitle>Editar Servicio</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Titulo</Label>
                                <Input type="text" id="title" placeholder="Titulo"
                                    {...register('title', {
                                        required: 'El Titulo es requerido.'
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
