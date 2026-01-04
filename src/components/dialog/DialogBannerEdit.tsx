import { updatedBanner } from "@/api/admin/banner.api.admin";
import type { IBanner, IBannerForm } from "@/models/admin.type";
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
import { useState, type ChangeEvent } from "react";

type DialogBannerEditProps = {
    banner: IBanner;
    setBanner: (banner: IBanner | null) => void
}

export default function DialogBannerEdit({banner, setBanner}: DialogBannerEditProps) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const [backgroundText, setBackgroundText] = useState(banner.background || "#F7F6F2")
    const page = searchParams.get('page') ?? 1
    const searchQuery = searchParams.get('search') ?? ""
    const form = useForm<IBannerForm>({
        defaultValues: {
            title: banner.title || "",
            description: banner.description || "",
            price: banner.price || null,
            background: banner.background || "#F7F6F2",
            image: null,
        }
    });
    const { register, handleSubmit, formState: { errors }, setValue } = form;

    const queryClient = useQueryClient();

    const modalEdit = searchParams.get('modal') === 'modalEdit'

    const hancleChangeDialog = () => {
        if (modalEdit) {
            const params = new URLSearchParams(searchParams);
            params.delete("modal");
            setSearchParams(params);
            setBanner(null)
        }
    }

    const mutate = useMutation({
        mutationFn: updatedBanner,
        onSuccess: (data) => {
            toast.success(data!)
            hancleChangeDialog();
            queryClient.invalidateQueries({ queryKey: ["banner", page, searchQuery] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleFormBanner = async (data: IBannerForm) => {
        const formData = new FormData();
        formData.append("description", data.description)
        formData.append("title", data.title.toString())
        formData.append("background", data.background.toString())
        if (data.price) {
            formData.append("price", data.price.toString())
        }
        formData.append("image", data.image ? data.image[0] : "");
        mutate.mutate({
            _id: banner._id, 
            formData
        })
    }

    const onChangeBGText = (e: ChangeEvent<HTMLInputElement>) => {
        const background: string = e.target.value;
        setBackgroundText(background.trim());
        setValue('background', background.trim())
    }

    const onChangeBackground = (e: ChangeEvent<HTMLInputElement>) => {
        const background: string = e.target.value;
        setBackgroundText(background.trim());
    }

    return (
        <Dialog open={modalEdit} onOpenChange={hancleChangeDialog}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormBanner)}>
                        <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Titulo</Label>
                                <Input type="text" id="title" placeholder="Titulo"
                                    {...register('title', {
                                        required: 'El titulo es requerida.',
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
                                <Label>Color de Fondo</Label>
                                <div className="grid grid-cols-[125px_1fr] gap-3">
                                    <div>
                                        <Input type="color" id="background" placeholder="Color de Fondo" 
                                            {...register('background', {
                                                required: 'La color de fondo es requerido.'
                                            })}
                                            onChange={onChangeBackground}
                                        />
                                    </div>
                                    <div>
                                        <Input type="text" id="backgroundText" placeholder="Color de Fondo" onChange={onChangeBGText} value={backgroundText} />
                                    </div>
                                </div>
                                {errors.background && (<InputError>{errors.background.message}</InputError>)}
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
