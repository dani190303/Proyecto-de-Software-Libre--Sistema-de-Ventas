export interface Usuario {
    id_usuario?: number;
    nombres: string;
    apellidos: string;
    username: string;
    password?: string;
    rol: string;
    estado?: number;
}
