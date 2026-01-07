-- Crear la base de datos
CREATE DATABASE proyecto_dssl;

-- Usar la base de datos
USE proyecto_dssl;



CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
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
    id_usuario INT NOT NULL,
    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE detalle_venta (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta),
    CONSTRAINT fk_detalle_venta_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
);



INSERT INTO usuario (nombres, apellidos, username, password, rol, estado) VALUES
('Roberto', 'Mendoza', 'roberto_admin', 'admin_agro99', 'Administrador', 1),
('Lucía', 'Torres', 'lucia_ventas', 'ventas_maquinaria', 'Vendedor', 1),
('Miguel', 'Ramos', 'migue_soporte', 'soporte_tecnico', 'Técnico', 1);


INSERT INTO categoria (nombre) VALUES
('Maquinaria Agrícola'),
('Maquinaria de Construcción'),
('Motores y Repuestos'),
('Herramientas Pesadas');


INSERT INTO producto (nombre, descripcion, precio, stock, estado, id_categoria) VALUES
('Tractor John Deere 6J', 'Tractor agrícola de 150 HP con tracción 4WD', 85000.00, 5, 1, 1),
('Cosechadora de Granos', 'Cosechadora automatizada con cabezal de 20 pies', 120000.00, 2, 1, 1),
('Excavadora Caterpillar 320', 'Excavadora hidráulica de 20 toneladas', 145000.00, 3, 1, 2),
('Retroexcavadora 416F2', 'Retroexcavadora versátil para obra civil', 75000.00, 4, 1, 2),
('Motor Diésel Industrial', 'Motor de 6 cilindros para generadores o riego', 12500.00, 10, 1, 3),
('Martillo Hidráulico', 'Accesorio para excavadora de alto impacto', 8900.00, 8, 1, 4);


SELECT u.username, u.rol FROM usuario u;
SELECT p.nombre, p.precio, c.nombre AS categoria 
FROM producto p 
JOIN categoria c ON p.id_categoria = c.id_categoria;

SELECT * FROM usuario;
SELECT * FROM categoria;
SELECT * FROM producto;

select * from producto;



