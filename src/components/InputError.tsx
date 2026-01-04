type InputErrorProps = {
    children: React.ReactNode;
}

export default function InputError({children}: InputErrorProps) {
    return (
        <p className="text-sm text-red-700">
            {children}
        </p>
    )
}
