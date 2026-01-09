-- Crear la base de datos
CREATE DATABASE proyecto_dssl;

-- Usar la base de datos
USE proyecto_dssl;



CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento VARCHAR(20), -- DNI o RUC
    estado TINYINT DEFAULT 1
);


CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    estado TINYINT DEFAULT 1,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);



CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    estado TINYINT DEFAULT 1
);



CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    total DECIMAL(10,2) NOT NULL, 

    tipo_cambio DECIMAL(10,4) NOT NULL,
    total_usd DECIMAL(10,2) NOT NULL,
    total_pen DECIMAL(10,2) NOT NULL,

    tipo_comprobante ENUM('BOLETA', 'FACTURA', 'COTIZACION') NOT NULL,

    id_usuario INT NOT NULL,
    id_cliente INT NULL,

    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
);



CREATE TABLE detalle_venta (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta),
    CONSTRAINT fk_detalle_venta_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
);

INSERT INTO categoria (nombre) VALUES
('Maquinaria Agrícola'),
('Maquinaria de Construcción'),
('Repuestos y Motores'),
('Herramientas Industriales'),
('Equipos de Seguridad');

INSERT INTO usuario (nombres, apellidos, username, password, rol, estado) VALUES
('Carlos', 'Gómez', 'cgomez', 'admin123', 'Administrador', 1),
('María', 'Ríos', 'mrios', 'ventas123', 'Vendedor', 1);

INSERT INTO cliente (nombres, apellidos, documento, estado) VALUES
('Juan', 'Pérez', '45678912', 1),
('Ana', 'Torres', '98765432', 1),
('Empresa', 'AgroPerú SAC', '20123456789', 1),
('Constructora', 'Los Andes SAC', '20456789123', 1);


INSERT INTO producto (nombre, descripcion, precio, stock, estado, id_categoria) VALUES
('Tractor Agrícola 110HP', 'Tractor para trabajos agrícolas pesados', 85000.00, 5, 1, 1),
('Arado de Discos', 'Arado para preparación de suelos', 4200.00, 10, 1, 1),

('Excavadora Hidráulica', 'Excavadora de 20 toneladas', 145000.00, 3, 1, 2),
('Retroexcavadora', 'Equipo mixto para obra civil', 98000.00, 2, 1, 2),

('Motor Diésel Industrial', 'Motor de alto rendimiento', 12500.00, 8, 1, 3),
('Bomba de Agua Industrial', 'Bomba para riego y construcción', 3800.00, 12, 1, 3),

('Taladro Industrial', 'Taladro de alta potencia', 980.00, 20, 1, 4),
('Amoladora Angular', 'Amoladora para corte de metal', 650.00, 18, 1, 4),

('Casco de Seguridad', 'Casco industrial certificado', 120.00, 25, 1, 5),
('Guantes de Seguridad', 'Guantes industriales reforzados', 45.00, 40, 1, 5);
