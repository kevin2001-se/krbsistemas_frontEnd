
type ButtonWebProps = {
    name: string;
    handleButtonAccion?: () => void
}

export default function ButtonWeb({name,  handleButtonAccion} : ButtonWebProps) {
    return (
        <button type="button" className="bg-primary text-white w-fit p-4 rounded-[10px]" onClick={handleButtonAccion}>
            {name}
        </button>
    )
}
