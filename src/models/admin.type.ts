export type IUser = {
    _id: string;
    username: string;
    email: string;
    isActive: boolean;
}

export type IUserPaginate = IUser & {
    createdAt: string
}

export type IUserFormEdit = Pick<IUser, 'username' | 'email' | 'isActive'>
export type IUserFormCreate = Pick<IUser, 'username' | 'email' | 'isActive'> & {
    password: string;
    password_confirm: string;
}
export type IUserChangePassword = {
    old_password: string;
    password: string;
    password_confirm: string;
}

export type LoginForm = Pick<IUser, 'username'> & {
    password: string;
}

export type IProduct = {
    _id: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    createdAt: string;
}

export type IProductRegister = Pick<IProduct, 'description' | 'price' | 'stock'>

export type IProductForm = Pick<IProduct, 'description' | 'price' | 'stock'> & {
    image: FileList | null;
}

export type IBanner = {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    background: string;
}

export type IBannerForm = Pick<IBanner, 'title' | 'description' | 'price' | 'background'> & {
    image: FileList | null;
}

export type IService = {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    createdAt: string;
}

export type IServiceForm = Pick<IService, 'title' | 'description' | 'price' > & {
    image: FileList | null;
}

export type TableType<T> = {
    data: T[],
    totalDocs: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export type TableColumnType = {
    name: string;
    column: string;
    type: 'date' | 'price' | 'string' | 'button' | 'image' | 'activo';
}