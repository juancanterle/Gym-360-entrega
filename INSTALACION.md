# 🏋️ GYM360 - Guía de Instalación Completa

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **MySQL 8.0**
   - Ya tienes MySQL80 instalado en localhost:3306
   - Usuario: `root`
   - Contraseña: `Willy2004@`

3. **Git** (opcional, para clonar el repositorio)

---

## 🚀 Paso 1: Preparar el Proyecto

### 1.1 Descargar el proyecto
Si tienes el ZIP, descomprímelo en una carpeta de tu elección.

### 1.2 Abrir terminal en la carpeta del proyecto
- **Windows**: Shift + Click derecho en la carpeta → "Abrir PowerShell aquí"
- **Mac/Linux**: Click derecho → "Abrir en Terminal"

### 1.3 Instalar dependencias
\`\`\`bash
npm install
\`\`\`

Esto instalará todas las librerías necesarias (React, Next.js, MySQL2, etc.)

---

## 🗄️ Paso 2: Configurar la Base de Datos

### 2.1 Abrir MySQL Workbench o tu cliente MySQL favorito

### 2.2 Conectarse a MySQL
- Host: `localhost:3306`
- Usuario: `root`
- Contraseña: `Willy2004@`

### 2.3 Ejecutar los scripts SQL EN ORDEN

#### Script 1: Crear la base de datos y tablas
\`\`\`sql
-- Copia y pega TODO el contenido del archivo:
-- scripts/01-create-database.sql
\`\`\`

**¿Qué hace este script?**
- Crea la base de datos `gym360_db`
- Crea 13 tablas: sucursales, usuarios_sistema, planes_membresia, miembros, membresías, entrenadores, tipos_clases, clases, inscripciones_clases, pagos, asistencias, usuarios_miembros
- Crea índices para optimizar consultas
- Crea un trigger para generar números de miembro automáticamente

#### Script 2: Insertar datos de ejemplo
\`\`\`sql
-- Copia y pega TODO el contenido del archivo:
-- scripts/02-insert-sample-data.sql
\`\`\`

**¿Qué datos inserta?**
- ✅ 4 Sucursales (Centro, Norte, Sur, Este)
- ✅ 5 Planes de membresía (Básico, Premium, VIP, Anual Básico, Anual Premium)
- ✅ 6 Entrenadores con especialidades
- ✅ 6 Tipos de clases (Yoga, CrossFit, Pilates, Spinning, Zumba, Funcional)
- ✅ 10 Miembros de ejemplo
- ✅ 10 Membresías activas
- ✅ 7 Clases programadas
- ✅ 16 Inscripciones a clases
- ✅ 10 Pagos registrados
- ✅ 10 Asistencias al gimnasio

#### Script 3: Crear usuarios de autenticación
\`\`\`sql
-- Copia y pega TODO el contenido del archivo:
-- scripts/03-insert-auth-users.sql
\`\`\`

**¿Qué usuarios crea?**

**USUARIOS DEL SISTEMA (Administradores):**
- 🔑 **Super Admin (Dueño del Gimnasio)**
  - Email: `dueno@gym360.com`
  - Contraseña: `superadmin123`
  - Rol: Super Admin (ve todas las sucursales)

- 🔑 **Admin Sucursal Centro**
  - Email: `admin.centro@gym360.com`
  - Contraseña: `admin123`
  - Rol: Admin de Sucursal Centro

- 🔑 **Admin Sucursal Norte**
  - Email: `admin.norte@gym360.com`
  - Contraseña: `admin123`
  - Rol: Admin de Sucursal Norte

- 🔑 **Admin Sucursal Sur**
  - Email: `admin.sur@gym360.com`
  - Contraseña: `admin123`
  - Rol: Admin de Sucursal Sur

- 🔑 **Admin Sucursal Este**
  - Email: `admin.este@gym360.com`
  - Contraseña: `admin123`
  - Rol: Admin de Sucursal Este

**USUARIOS MIEMBROS (Clientes):**
- 🔑 **Pedro González**
  - Email: `pedro.gonzalez@email.com`
  - Contraseña: `cliente123`
  - Sucursal: Centro

- 🔑 **Lucía Fernández**
  - Email: `lucia.fernandez@email.com`
  - Contraseña: `cliente123`
  - Sucursal: Centro

- 🔑 **Miguel Torres**
  - Email: `miguel.torres@email.com`
  - Contraseña: `cliente123`
  - Sucursal: Centro

- 🔑 **Carmen Ruiz**
  - Email: `carmen.ruiz@email.com`
  - Contraseña: `cliente123`
  - Sucursal: Norte

- 🔑 **Andrés Morales**
  - Email: `andres.morales@email.com`
  - Contraseña: `cliente123`
  - Sucursal: Norte

### 2.4 Verificar que los datos se insertaron correctamente

Ejecuta estas consultas para verificar:

\`\`\`sql
-- Ver todas las sucursales
SELECT * FROM gym360_db.sucursales;

-- Ver todos los usuarios del sistema
SELECT us.email, us.rol, s.nombre as sucursal 
FROM gym360_db.usuarios_sistema us 
LEFT JOIN gym360_db.sucursales s ON us.sucursal_id = s.id;

-- Ver todos los miembros
SELECT m.numero_miembro, m.nombre, m.apellido, m.email, s.nombre as sucursal
FROM gym360_db.miembros m
LEFT JOIN gym360_db.sucursales s ON m.sucursal_id = s.id;

-- Ver usuarios miembros con sus credenciales
SELECT um.email, m.nombre, m.apellido, m.numero_miembro 
FROM gym360_db.usuarios_miembros um 
JOIN gym360_db.miembros m ON um.miembro_id = m.id;

-- Ver clases programadas
SELECT c.id, tc.nombre as tipo_clase, e.nombre as entrenador, 
       s.nombre as sucursal, c.fecha, c.hora_inicio, c.hora_fin,
       c.inscritos_actuales, c.capacidad_maxima
FROM gym360_db.clases c
JOIN gym360_db.tipos_clases tc ON c.tipo_clase_id = tc.id
JOIN gym360_db.entrenadores e ON c.entrenador_id = e.id
JOIN gym360_db.sucursales s ON c.sucursal_id = s.id
ORDER BY c.fecha, c.hora_inicio;

-- Ver membresías activas
SELECT m.numero_miembro, CONCAT(m.nombre, ' ', m.apellido) as miembro,
       pm.nombre as plan, mem.fecha_inicio, mem.fecha_fin, mem.estado
FROM gym360_db.membresias mem
JOIN gym360_db.miembros m ON mem.miembro_id = m.id
JOIN gym360_db.planes_membresia pm ON mem.plan_id = pm.id
WHERE mem.estado = 'activa';
\`\`\`

**✅ Si ves datos en todas estas consultas, la base de datos está lista!**

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env.local

En la raíz del proyecto, crea un archivo llamado `.env.local` con este contenido:

\`\`\`env
# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Willy2004@
DB_NAME=gym360_db
DB_PORT=3306
\`\`\`

**IMPORTANTE:** Este archivo NO debe subirse a Git (ya está en .gitignore)

---

## 🎯 Paso 4: Ejecutar la Aplicación

### 4.1 Iniciar el servidor de desarrollo

\`\`\`bash
npm run dev
\`\`\`

### 4.2 Abrir el navegador

Abre tu navegador y ve a: **http://localhost:3000**

Deberías ver la pantalla de login con el fondo del gimnasio.

---

## 🔐 Paso 5: Probar el Sistema

### 5.1 Probar como DUEÑO DEL GIMNASIO (Super Admin)

1. En la pantalla de login, ingresa:
   - **Email:** `dueno@gym360.com`
   - **Contraseña:** `superadmin123`

2. Click en "Iniciar Sesión"

3. Deberías ver el **Dashboard de Super Admin** con:
   - Estadísticas de TODAS las sucursales
   - Total de miembros activos
   - Ingresos totales
   - Clases programadas
   - Gráficos de rendimiento

### 5.2 Probar como CLIENTE NUEVO (Registro)

1. En la pantalla de login, click en "Registrarse" o "Crear cuenta"

2. Completa el formulario:
   - Nombre: Tu nombre
   - Apellido: Tu apellido
   - Email: tu-email@ejemplo.com
   - Teléfono: 555-1234
   - Contraseña: minimo6caracteres
   - Confirmar contraseña: minimo6caracteres

3. Click en "Continuar"

4. **Selecciona una sucursal** de la lista (Centro, Norte, Sur o Este)
   - Verás la dirección de cada sucursal
   - Puedes ver la ubicación en Google Maps

5. Click en "Completar Registro"

6. Deberías ver el **Dashboard de Cliente** con:
   - Clases disponibles en TU sucursal
   - Horarios de las clases
   - Tus reservas (si tienes)
   - Tu información de membresía

### 5.3 Probar como CLIENTE EXISTENTE

1. En la pantalla de login, ingresa:
   - **Email:** `pedro.gonzalez@email.com`
   - **Contraseña:** `cliente123`

2. Deberías ver el Dashboard de Cliente con datos reales de la base de datos

### 5.4 Probar como ADMIN DE SUCURSAL

1. En la pantalla de login, ingresa:
   - **Email:** `admin.centro@gym360.com`
   - **Contraseña:** `admin123`

2. Deberías ver el **Dashboard de Admin de Sucursal** con:
   - Estadísticas de la Sucursal Centro
   - Miembros de esa sucursal
   - Clases programadas
   - Pagos pendientes

---

## 📊 Datos Reales en la Base de Datos

### Resumen de lo que tienes:

| Tabla | Cantidad | Descripción |
|-------|----------|-------------|
| **Sucursales** | 4 | Centro, Norte, Sur, Este |
| **Usuarios Sistema** | 5 | 1 Super Admin + 4 Admins de Sucursal |
| **Usuarios Miembros** | 5 | Clientes con login |
| **Miembros** | 10 | Clientes registrados |
| **Planes** | 5 | Básico, Premium, VIP, Anual Básico, Anual Premium |
| **Membresías** | 10 | 9 activas, 1 vencida |
| **Entrenadores** | 6 | Con especialidades |
| **Tipos de Clases** | 6 | Yoga, CrossFit, Pilates, Spinning, Zumba, Funcional |
| **Clases** | 7 | Programadas para hoy y próximos días |
| **Inscripciones** | 16 | Miembros inscritos en clases |
| **Pagos** | 10 | 5 pagados, 3 pendientes, 2 vencidos |
| **Asistencias** | 10 | Registros de entrada/salida |

---

## 🐛 Solución de Problemas

### Problema: "Cannot connect to database"

**Solución:**
1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en `.env.local`
3. Verifica que la base de datos `gym360_db` exista

### Problema: "No se cargan las sucursales en el registro"

**Solución:**
1. Verifica que ejecutaste el script `02-insert-sample-data.sql`
2. Verifica en MySQL: `SELECT * FROM gym360_db.sucursales;`
3. Revisa la consola del navegador (F12) para ver errores

### Problema: "Login no funciona"

**Solución:**
1. Verifica que ejecutaste el script `03-insert-auth-users.sql`
2. Usa las credenciales exactas listadas arriba
3. Revisa la consola del navegador (F12) para ver errores

### Problema: "El dashboard está vacío"

**Solución:**
1. Verifica que ejecutaste TODOS los scripts SQL
2. Verifica que hay datos: `SELECT COUNT(*) FROM gym360_db.miembros;`
3. Revisa la consola del navegador (F12) para ver errores de API

---

## 📝 Notas Importantes

1. **Contraseñas en Base64:** Las contraseñas en la base de datos están codificadas en Base64 (no es seguro para producción, solo para desarrollo)

2. **Datos de Prueba:** Todos los datos son de ejemplo. Puedes modificarlos o agregar más según necesites.

3. **Puerto 3000:** Si el puerto 3000 está ocupado, Next.js usará el 3001 automáticamente.

4. **Hot Reload:** Los cambios en el código se reflejan automáticamente sin reiniciar el servidor.

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, ahora tienes:

✅ Base de datos MySQL configurada con datos reales
✅ Sistema GYM360 corriendo en localhost:3000
✅ Login funcionando para dueño, admins y clientes
✅ Registro de nuevos usuarios funcionando
✅ Dashboards mostrando datos reales de la base de datos
✅ Selección de sucursales desde la base de datos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección "Solución de Problemas"
2. Verifica los logs en la terminal donde corre `npm run dev`
3. Revisa la consola del navegador (F12 → Console)
4. Verifica que todos los scripts SQL se ejecutaron correctamente

---

**¡Disfruta tu sistema GYM360! 🏋️‍♂️💪**
