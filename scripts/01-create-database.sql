-- GYM360 Database Schema
-- Canónico de la Base de Datos para el Dashboard

DROP DATABASE IF EXISTS gym360_db;
CREATE DATABASE IF NOT EXISTS gym360_db;
USE gym360_db;

-- 1) Tabla de sucursales
CREATE TABLE sucursales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    capacidad_maxima INT NOT NULL,
    fecha_apertura DATE,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) Tabla de usuarios del sistema
CREATE TABLE usuarios_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol ENUM('super_admin', 'admin_sucursal', 'staff') DEFAULT 'staff',
    sucursal_id INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- 3) Planes de membresía
CREATE TABLE planes_membresia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(10,2) NOT NULL,
    duracion_meses INT NOT NULL,
    acceso_clases BOOLEAN DEFAULT TRUE,
    acceso_equipos BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4) Miembros
CREATE TABLE miembros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_miembro VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    genero ENUM('M','F','Otro'),
    direccion TEXT,
    fecha_registro DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    sucursal_id INT,
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- 5) Membresías
CREATE TABLE membresias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    miembro_id INT NOT NULL,
    plan_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio_pagado DECIMAL(10,2) NOT NULL,
    estado ENUM('activa', 'vencida', 'cancelada', 'suspendida') DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (miembro_id) REFERENCES miembros(id),
    FOREIGN KEY (plan_id) REFERENCES planes_membresia(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- 6) Entrenadores
CREATE TABLE entrenadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    especialidades TEXT,
    certificaciones TEXT,
    fecha_contratacion DATE,
    salario_base DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    sucursal_id INT,
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- 7) Tipos de clases
CREATE TABLE tipos_clases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    capacidad_maxima INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- 8) Clases
CREATE TABLE clases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_clase_id INT NOT NULL,
    entrenador_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    capacidad_maxima INT NOT NULL,
    inscritos_actuales INT DEFAULT 0,
    estado ENUM('programada', 'en_curso', 'completada', 'cancelada') DEFAULT 'programada',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_clase_id) REFERENCES tipos_clases(id),
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- 9) Inscripciones a clases
CREATE TABLE inscripciones_clases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clase_id INT NOT NULL,
    miembro_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    asistio BOOLEAN DEFAULT FALSE,
    fecha_asistencia TIMESTAMP NULL,
    FOREIGN KEY (clase_id) REFERENCES clases(id),
    FOREIGN KEY (miembro_id) REFERENCES miembros(id),
    UNIQUE KEY unique_inscripcion (clase_id, miembro_id)
);

-- 10) Pagos
CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    membresia_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    metodo_pago ENUM('efectivo','tarjeta','transferencia','debito_automatico') NOT NULL,
    estado ENUM('pendiente','pagado','vencido','cancelado') DEFAULT 'pendiente',
    referencia_pago VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (membresia_id) REFERENCES membresias(id)
);

-- 11) Asistencias
CREATE TABLE asistencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    miembro_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    fecha_entrada TIMESTAMP NOT NULL,
    fecha_salida TIMESTAMP NULL,
    duracion_minutos INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (miembro_id) REFERENCES miembros(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- 12) Usuarios miembros
CREATE TABLE usuarios_miembros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    miembro_id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (miembro_id) REFERENCES miembros(id)
);

-- 13) Índices
CREATE INDEX idx_membresias_estado ON membresias(estado);
CREATE INDEX idx_membresias_fecha_inicio ON membresias(fecha_inicio);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_fecha_vencimiento ON pagos(fecha_vencimiento);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha_entrada);
CREATE INDEX idx_clases_fecha ON clases(fecha);
CREATE INDEX idx_inscripciones_asistio ON inscripciones_clases(asistio);

DELIMITER //
CREATE TRIGGER before_insert_miembros
BEFORE INSERT ON miembros
FOR EACH ROW
BEGIN
  IF NEW.numero_miembro IS NULL OR NEW.numero_miembro = '' THEN
    SET NEW.numero_miembro = CONCAT('M', LPAD((SELECT IFNULL(MAX(id),0) + 1 FROM miembros), 6, '0'));
  END IF;
END;
//
DELIMITER ;
