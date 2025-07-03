export enum presentacionProducto {
    Cono = 'Cono',
    Envase= 'Envase',
    Copa = 'Copa'
}

export const presentacionsOptions = Object.values(presentacionProducto).map(presentacion => ({
    label: presentacion,
    value: presentacion
}));

