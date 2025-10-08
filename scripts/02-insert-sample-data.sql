USE gym360_db;

-- Super Admin
INSERT INTO usuarios_sistema (id, email, password_hash, nombre, apellido, rol, sucursal_id)
VALUES (1, 'dueno@gym360.com', 'c3VwZXJhZG1pbjEyMw==', 'Propietario', 'Sistema', 'super_admin', NULL)
AS new
ON DUPLICATE KEY UPDATE
    password_hash = new.password_hash,
    nombre = new.nombre,
    apellido = new.apellido,
    rol = new.rol,
    sucursal_id = new.sucursal_id;

-- Sucursales
INSERT INTO sucursales (id, nombre, direccion, telefono, email, capacidad_maxima, fecha_apertura)
VALUES
(1, 'Sucursal Centro', 'Av. Principal 123, Centro', '555-0101', 'centro@gym360.com', 200, '2020-01-15'),
(2, 'Sucursal Norte', 'Calle Norte 456, Zona Norte', '555-0102', 'norte@gym360.com', 150, '2020-06-20'),
(3, 'Sucursal Sur', 'Av. Sur 789, Zona Sur', '555-0103', 'sur@gym360.com', 180, '2021-03-10'),
(4, 'Sucursal Este', 'Blvd. Este 321, Zona Este', '555-0104', 'este@gym360.com', 120, '2021-09-05')
AS new
ON DUPLICATE KEY UPDATE
    nombre = new.nombre,
    direccion = new.direccion,
    telefono = new.telefono,
    email = new.email,
    capacidad_maxima = new.capacidad_maxima,
    fecha_apertura = new.fecha_apertura;

-- Administradores de sucursal
INSERT INTO usuarios_sistema (id, email, password_hash, nombre, apellido, rol, sucursal_id)
VALUES
(2, 'admin.centro@gym360.com', 'YWRtaW4xMjM=', 'Carlos', 'Administrador', 'admin_sucursal', 1),
(3, 'admin.norte@gym360.com', 'YWRtaW4xMjM=', 'María', 'Gestora', 'admin_sucursal', 2),
(4, 'admin.sur@gym360.com', 'YWRtaW4xMjM=', 'Roberto', 'Manager', 'admin_sucursal', 3),
(5, 'admin.este@gym360.com', 'YWRtaW4xMjM=', 'Ana', 'Coordinadora', 'admin_sucursal', 4)
AS new
ON DUPLICATE KEY UPDATE
    password_hash = new.password_hash,
    nombre = new.nombre,
    apellido = new.apellido,
    rol = new.rol,
    sucursal_id = new.sucursal_id;

-- Planes de membresía
INSERT INTO planes_membresia (id, nombre, descripcion, precio_mensual, duracion_meses)
VALUES
(1, 'Plan Básico', 'Acceso a equipos básicos', 29.99, 1),
(2, 'Plan Premium', 'Acceso completo + clases grupales', 49.99, 1),
(3, 'Plan VIP', 'Acceso completo + entrenador personal', 79.99, 1),
(4, 'Plan Anual Básico', 'Plan básico con descuento anual', 25.99, 12),
(5, 'Plan Anual Premium', 'Plan premium con descuento anual', 42.99, 12)
AS new
ON DUPLICATE KEY UPDATE
    nombre = new.nombre,
    descripcion = new.descripcion,
    precio_mensual = new.precio_mensual,
    duracion_meses = new.duracion_meses;

-- Entrenadores
INSERT INTO entrenadores (id, nombre, apellido, email, telefono, especialidades, fecha_contratacion, salario_base, sucursal_id)
VALUES
(1, 'Juan', 'Pérez', 'juan.perez@gym360.com', '555-1001', 'CrossFit, Funcional', '2020-02-01', 2500.00, 1),
(2, 'María', 'García', 'maria.garcia@gym360.com', '555-1002', 'Yoga, Pilates', '2020-03-15', 2300.00, 1),
(3, 'Carlos', 'López', 'carlos.lopez@gym360.com', '555-1003', 'Spinning, Cardio', '2020-05-20', 2400.00, 2),
(4, 'Ana', 'Martínez', 'ana.martinez@gym360.com', '555-1004', 'Zumba, Baile', '2020-07-10', 2200.00, 2),
(5, 'Roberto', 'Silva', 'roberto.silva@gym360.com', '555-1005', 'Musculación, Powerlifting', '2021-01-05', 2600.00, 3),
(6, 'Laura', 'Rodríguez', 'laura.rodriguez@gym360.com', '555-1006', 'Aqua Aeróbicos, Natación', '2021-04-12', 2350.00, 3)
AS new
ON DUPLICATE KEY UPDATE
    nombre = new.nombre,
    apellido = new.apellido,
    telefono = new.telefono,
    especialidades = new.especialidades,
    fecha_contratacion = new.fecha_contratacion,
    salario_base = new.salario_base,
    sucursal_id = new.sucursal_id;

-- Tipos de clases
INSERT INTO tipos_clases (id, nombre, descripcion, duracion_minutos, capacidad_maxima)
VALUES
(1, 'Yoga', 'Clase de yoga para todos los niveles', 60, 20),
(2, 'CrossFit', 'Entrenamiento funcional de alta intensidad', 45, 15),
(3, 'Pilates', 'Fortalecimiento del core y flexibilidad', 50, 18),
(4, 'Spinning', 'Ciclismo indoor con música', 45, 25),
(5, 'Zumba', 'Baile fitness con ritmos latinos', 60, 30),
(6, 'Funcional', 'Entrenamiento funcional grupal', 50, 20)
AS new
ON DUPLICATE KEY UPDATE
    nombre = new.nombre,
    descripcion = new.descripcion,
    duracion_minutos = new.duracion_minutos,
    capacidad_maxima = new.capacidad_maxima;

-- Miembros
INSERT INTO miembros (id, numero_miembro, nombre, apellido, email, telefono, fecha_nacimiento, genero, fecha_registro, sucursal_id)
VALUES
(1, 'GYM001', 'Pedro', 'González', 'pedro.gonzalez@email.com', '555-2001', '1985-03-15', 'M', '2023-01-10', 1),
(2, 'GYM002', 'Lucía', 'Fernández', 'lucia.fernandez@email.com', '555-2002', '1990-07-22', 'F', '2023-01-15', 1),
(3, 'GYM003', 'Miguel', 'Torres', 'miguel.torres@email.com', '555-2003', '1988-11-08', 'M', '2023-02-01', 1),
(4, 'GYM004', 'Carmen', 'Ruiz', 'carmen.ruiz@email.com', '555-2004', '1992-05-30', 'F', '2023-02-10', 2),
(5, 'GYM005', 'Andrés', 'Morales', 'andres.morales@email.com', '555-2005', '1987-09-12', 'M', '2023-02-15', 2),
(6, 'GYM006', 'Isabel', 'Jiménez', 'isabel.jimenez@email.com', '555-2006', '1991-12-03', 'F', '2023-03-01', 2),
(7, 'GYM007', 'Francisco', 'Herrera', 'francisco.herrera@email.com', '555-2007', '1989-04-18', 'M', '2023-03-10', 3),
(8, 'GYM008', 'Elena', 'Vargas', 'elena.vargas@email.com', '555-2008', '1993-08-25', 'F', '2023-03-15', 3),
(9, 'GYM009', 'Javier', 'Castro', 'javier.castro@email.com', '555-2009', '1986-01-14', 'M', '2023-04-01', 3),
(10, 'GYM010', 'Natalia', 'Ortega', 'natalia.ortega@email.com', '555-2010', '1994-06-07', 'F', '2023-04-10', 4)
AS new
ON DUPLICATE KEY UPDATE
    nombre = new.nombre,
    apellido = new.apellido,
    telefono = new.telefono,
    sucursal_id = new.sucursal_id;

-- Membresías
INSERT INTO membresias (id, miembro_id, plan_id, sucursal_id, fecha_inicio, fecha_fin, precio_pagado, estado)
VALUES
(1, 1, 2, 1, '2024-01-01', '2024-12-31', 49.99, 'activa'),
(2, 2, 1, 1, '2024-02-01', '2024-02-28', 29.99, 'activa'),
(3, 3, 3, 1, '2024-01-15', '2025-01-15', 79.99, 'activa'),
(4, 4, 2, 2, '2024-03-01', '2024-03-31', 49.99, 'activa'),
(5, 5, 1, 2, '2024-02-15', '2024-02-29', 29.99, 'vencida'),
(6, 6, 2, 2, '2024-04-01', '2024-04-30', 49.99, 'activa'),
(7, 7, 3, 3, '2024-01-20', '2025-01-20', 79.99, 'activa'),
(8, 8, 1, 3, '2024-03-15', '2024-03-31', 29.99, 'activa'),
(9, 9, 2, 3, '2024-02-01', '2024-02-28', 49.99, 'activa'),
(10, 10, 1, 4, '2024-04-05', '2024-04-30', 29.99, 'activa')
AS new
ON DUPLICATE KEY UPDATE
    plan_id = new.plan_id,
    sucursal_id = new.sucursal_id,
    fecha_inicio = new.fecha_inicio,
    fecha_fin = new.fecha_fin,
    precio_pagado = new.precio_pagado,
    estado = new.estado;

-- Clases
INSERT INTO clases (id, tipo_clase_id, entrenador_id, sucursal_id, fecha, hora_inicio, hora_fin, capacidad_maxima, inscritos_actuales)
VALUES
(1, 1, 2, 1, CURDATE(), '08:00:00', '09:00:00', 20, 15),
(2, 2, 1, 1, CURDATE(), '18:00:00', '18:45:00', 15, 12),
(3, 3, 2, 1, CURDATE() + INTERVAL 1 DAY, '10:00:00', '10:50:00', 18, 14),
(4, 4, 3, 2, CURDATE(), '19:00:00', '19:45:00', 25, 22),
(5, 5, 4, 2, CURDATE() + INTERVAL 1 DAY, '17:00:00', '18:00:00', 30, 28),
(6, 6, 5, 3, CURDATE(), '07:00:00', '07:50:00', 20, 16),
(7, 1, 6, 3, CURDATE() + INTERVAL 2 DAY, '09:00:00', '10:00:00', 20, 18)
AS new
ON DUPLICATE KEY UPDATE
    tipo_clase_id = new.tipo_clase_id,
    entrenador_id = new.entrenador_id,
    sucursal_id = new.sucursal_id,
    fecha = new.fecha,
    hora_inicio = new.hora_inicio,
    hora_fin = new.hora_fin,
    capacidad_maxima = new.capacidad_maxima,
    inscritos_actuales = new.inscritos_actuales;

-- Inscripciones
INSERT INTO inscripciones_clases (id, clase_id, miembro_id, asistio)
VALUES
(1, 1, 1, TRUE),
(2, 1, 2, TRUE),
(3, 1, 3, FALSE),
(4, 2, 1, TRUE),
(5, 2, 3, TRUE),
(6, 3, 2, FALSE),
(7, 4, 4, TRUE),
(8, 4, 5, TRUE),
(9, 4, 6, FALSE),
(10, 5, 4, TRUE),
(11, 5, 6, TRUE),
(12, 6, 7, TRUE),
(13, 6, 8, FALSE),
(14, 6, 9, TRUE),
(15, 7, 7, FALSE),
(16, 7, 8, TRUE)
AS new
ON DUPLICATE KEY UPDATE
    asistio = new.asistio;

-- Pagos
INSERT INTO pagos (id, membresia_id, monto, fecha_pago, fecha_vencimiento, metodo_pago, estado)
VALUES
(1, 1, 49.99, '2024-01-01', '2024-01-31', 'tarjeta', 'pagado'),
(2, 2, 29.99, '2024-02-01', '2024-02-28', 'efectivo', 'pagado'),
(3, 3, 79.99, '2024-01-15', '2024-02-15', 'debito_automatico', 'pagado'),
(4, 4, 49.99, '2024-03-01', '2024-03-31', 'tarjeta', 'pagado'),
(5, 5, 29.99, '2024-02-15', '2024-03-15', 'efectivo', 'vencido'),
(6, 6, 49.99, '2024-04-01', '2024-04-30', 'transferencia', 'pendiente'),
(7, 7, 79.99, '2024-01-20', '2024-02-20', 'debito_automatico', 'pagado'),
(8, 8, 29.99, '2024-03-15', '2024-04-15', 'efectivo', 'pendiente'),
(9, 9, 49.99, '2024-02-01', '2024-03-01', 'tarjeta', 'vencido'),
(10, 10, 29.99, '2024-04-05', '2024-05-05', 'efectivo', 'pendiente')
AS new
ON DUPLICATE KEY UPDATE
    monto = new.monto,
    fecha_pago = new.fecha_pago,
    fecha_vencimiento = new.fecha_vencimiento,
    metodo_pago = new.metodo_pago,
    estado = new.estado;

-- Asistencias
INSERT INTO asistencias (id, miembro_id, sucursal_id, fecha_entrada, fecha_salida, duracion_minutos)
VALUES
(1, 1, 1, '2024-06-01 08:30:00', '2024-06-01 10:00:00', 90),
(2, 2, 1, '2024-06-01 18:00:00', '2024-06-01 19:30:00', 90),
(3, 3, 1, '2024-06-01 07:00:00', '2024-06-01 08:30:00', 90),
(4, 4, 2, '2024-06-01 19:00:00', '2024-06-01 20:15:00', 75),
(5, 5, 2, '2024-06-01 17:30:00', '2024-06-01 18:45:00', 75),
(6, 6, 2, '2024-06-01 09:00:00', '2024-06-01 10:30:00', 90),
(7, 7, 3, '2024-06-01 07:00:00', '2024-06-01 08:30:00', 90),
(8, 8, 3, '2024-06-01 16:00:00', '2024-06-01 17:30:00', 90),
(9, 9, 3, '2024-06-01 18:30:00', '2024-06-01 20:00:00', 90),
(10, 10, 4, '2024-06-01 08:00:00', '2024-06-01 09:15:00', 75)
AS new
ON DUPLICATE KEY UPDATE