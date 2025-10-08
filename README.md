# GYM360 Dashboard

Dashboard web para gestión integral de cadena de gimnasios.

## Configuración de la Base de Datos

### Requisitos Previos
- MySQL 8.0 instalado y corriendo en localhost:3306
- Usuario root con acceso a la base de datos

### Pasos de Instalación

1. **Instalar dependencias**
   \`\`\`bash
   npm install
   # o
   pnpm install
   \`\`\`

2. **Configurar variables de entorno**
   
   El archivo `.env.local` ya está configurado con:
   - Host: localhost
   - Usuario: root
   - Contraseña: Willy2004@
   - Base de datos: gym360_db
   - Puerto: 3306

3. **Crear la base de datos y tablas**
   
   Ejecuta los scripts SQL en orden desde MySQL Workbench o línea de comandos:
   
   \`\`\`bash
   mysql -u root -p < scripts/01-create-database.sql
   mysql -u root -p < scripts/02-insert-sample-data.sql
   mysql -u root -p < scripts/03-insert-auth-users.sql
   \`\`\`
   
   O desde MySQL Workbench:
   - Abre cada archivo SQL en el editor
   - Ejecuta el script completo

4. **Iniciar el servidor de desarrollo**
   \`\`\`bash
   npm run dev
   # o
   pnpm dev
   \`\`\`

5. **Acceder a la aplicación**
   
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Usuarios de Prueba

Después de ejecutar los scripts, tendrás estos usuarios disponibles:

- **Super Admin**: superadmin@gym360.com / admin123
- **Admin Sucursal Norte**: admin.norte@gym360.com / admin123
- **Admin Sucursal Sur**: admin.sur@gym360.com / admin123
- **Cliente**: juan.perez@email.com / cliente123

## Estructura de la Base de Datos

La base de datos incluye las siguientes tablas principales:
- `sucursales` - Información de las sucursales
- `usuarios_sistema` - Usuarios administrativos
- `miembros` - Miembros del gimnasio
- `membresias` - Membresías activas
- `clases` - Clases programadas
- `pagos` - Registro de pagos
- `asistencias` - Control de asistencia

## Tecnologías

- Next.js 15
- React 19
- MySQL 8.0
- Tailwind CSS 4
- shadcn/ui
