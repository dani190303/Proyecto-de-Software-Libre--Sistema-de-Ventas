export interface Cliente {
    id_cliente: number;
    documento: string; // DNI o RUC
    nombres: string;
    apellidos: string;
    estado?: number;
}
