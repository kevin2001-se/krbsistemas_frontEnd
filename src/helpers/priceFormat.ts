export function formatPrecio(precio: number) {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
    }).format(precio);
}