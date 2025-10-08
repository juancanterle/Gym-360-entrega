-- Script para insertar usuarios de autenticación
-- IMPORTANTE: Las contraseñas están en Base64 para desarrollo
-- En producción se debe usar bcrypt

USE gym360_db;

-- ============================================
-- USUARIOS DEL SISTEMA (Administradores)
-- ============================================

-- Super Admin (Dueño del Gimnasio)
-- Email: dueno@gym360.com
-- Contraseña: superadmin123
INSERT INTO usuarios_sistema (email, password_hash, nombre, apellido, rol, sucursal_id) VALUES
('dueno@gym360.com', 'c3VwZXJhZG1pbjEyMw==', 'Propietario', 'Sistema', 'super_admin', NULL)
ON DUPLICATE KEY UPDATE
    password_hash = 'c3VwZXJhZG1pbjEyMw==',
    nombre = 'Propietario',
    apellido = 'Sistema',
    rol = 'super_admin',
    sucursal_id = NULL;

-- Admin Sucursal Centro
-- Email: admin.centro@gym360.com
-- Contraseña: admin123
INSERT INTO usuarios_sistema (email, password_hash, nombre, apellido, rol, sucursal_id) VALUES
('admin.centro@gym360.com', 'YWRtaW4xMjM=', 'Carlos', 'Administrador', 'admin_sucursal', 1)
ON DUPLICATE KEY UPDATE
    password_hash = 'YWRtaW4xMjM=',
    nombre = 'Carlos',
    apellido = 'Administrador',
    rol = 'admin_sucursal',
    sucursal_id = 1;

-- Admin Sucursal Norte
-- Email: admin.norte@gym360.com
-- Contraseña: admin123
INSERT INTO usuarios_sistema (email, password_hash, nombre, apellido, rol, sucursal_id) VALUES
('admin.norte@gym360.com', 'YWRtaW4xMjM=', 'María', 'Gestora', 'admin_sucursal', 2)
ON DUPLICATE KEY UPDATE
    password_hash = 'YWRtaW4xMjM=',
    nombre = 'María',
    apellido = 'Gestora',
    rol = 'admin_sucursal',
    sucursal_id = 2;

-- Admin Sucursal Sur
-- Email: admin.sur@gym360.com
-- Contraseña: admin123
INSERT INTO usuarios_sistema (email, password_hash, nombre, apellido, rol, sucursal_id) VALUES
('admin.sur@gym360.com', 'YWRtaW4xMjM=', 'Roberto', 'Manager', 'admin_sucursal', 3)
ON DUPLICATE KEY UPDATE
    password_hash = 'YWRtaW4xMjM=',
    nombre = 'Roberto',
    apellido = 'Manager',
    rol = 'admin_sucursal',
    sucursal_id = 3;

-- Admin Sucursal Este
-- Email: admin.este@gym360.com
-- Contraseña: admin123
INSERT INTO usuarios_sistema (email, password_hash, nombre, apellido, rol, sucursal_id) VALUES
('admin.este@gym360.com', 'YWRtaW4xMjM=', 'Ana', 'Coordinadora', 'admin_sucursal', 4)
ON DUPLICATE KEY UPDATE
    password_hash = 'YWRtaW4xMjM=',
    nombre = 'Ana',
    apellido = 'Coordinadora',
    rol = 'admin_sucursal',
    sucursal_id = 4;

-- ============================================
-- USUARIOS MIEMBROS (Clientes)
-- ============================================

-- Todos los clientes tienen la contraseña: cliente123

INSERT INTO usuarios_miembros (miembro_id, email, password_hash) VALUES
(1, 'pedro.gonzalez@email.com', 'Y2xpZW50ZTEyMw=='),
(2, 'lucia.fernandez@email.com', 'Y2xpZW50ZTEyMw=='),
(3, 'miguel.torres@email.com', 'Y2xpZW50ZTEyMw=='),
(4, 'carmen.ruiz@email.com', 'Y2xpZW50ZTEyMw=='),
(5, 'andres.morales@email.com', 'Y2xpZW50ZTEyMw==')
ON DUPLICATE KEY UPDATE
    password_hash = 'Y2xpZW50ZTEyMw==';

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT '========================================' as '';
SELECT 'USUARIOS DEL SISTEMA (Administradores)' as '';
SELECT '========================================' as '';
SELECT 
    us.email as 'Email', 
    CASE 
        WHEN us.rol = 'super_admin' THEN 'Super Admin (Dueño)'
        WHEN us.rol = 'admin_sucursal' THEN 'Admin de Sucursal'
        ELSE us.rol
    END as 'Rol',
    IFNULL(s.nombre, 'Todas las sucursales') as 'Sucursal',
    CASE 
        WHEN us.email = 'dueno@gym360.com' THEN 'superadmin123'
        ELSE 'admin123'
    END as 'Contraseña'
FROM usuarios_sistema us 
LEFT JOIN sucursales s ON us.sucursal_id = s.id
ORDER BY us.rol DESC, us.id;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'USUARIOS MIEMBROS (Clientes)' as '';
SELECT '========================================' as '';
SELECT 
    um.email as 'Email', 
    CONCAT(m.nombre, ' ', m.apellido) as 'Nombre Completo',
    m.numero_miembro as 'Número de Miembro',
    s.nombre as 'Sucursal',
    'cliente123' as 'Contraseña'
FROM usuarios_miembros um 
JOIN miembros m ON um.miembro_id = m.id
LEFT JOIN sucursales s ON m.sucursal_id = s.id
ORDER BY m.id;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'RESUMEN' as '';
SELECT '========================================' as '';
SELECT 
    (SELECT COUNT(*) FROM usuarios_sistema WHERE rol = 'super_admin') as 'Super Admins',
    (SELECT COUNT(*) FROM usuarios_sistema WHERE rol = 'admin_sucursal') as 'Admins de Sucursal',
    (SELECT COUNT(*) FROM usuarios_miembros) as 'Clientes con Login',
    (SELECT COUNT(*) FROM miembros) as 'Total Miembros Registrados';
