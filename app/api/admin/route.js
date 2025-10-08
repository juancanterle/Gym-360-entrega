const { executeQuery } = require("../../../lib/database")
const { encryptPassword } = require("../../../lib/auth")

// GET - Obtener todos los administradores
export async function GET(request) {
  try {
    const query = `
      SELECT 
        us.id,
        us.nombre,
        us.apellido,
        us.email,
        us.rol,
        us.sucursal_id,
        us.activo,
        us.fecha_creacion,
        s.nombre as sucursal_nombre
      FROM usuarios_sistema us
      LEFT JOIN sucursales s ON us.sucursal_id = s.id
      WHERE us.rol = 'admin_sucursal'
      ORDER BY us.nombre, us.apellido
    `

    const admins = await executeQuery(query)

    return Response.json({
      success: true,
      data: admins,
    })
  } catch (error) {
    console.error("Error obteniendo administradores:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo administrador
export async function POST(request) {
  try {
    const { nombre, apellido, email, password, sucursal_id } = await request.json()

    if (!nombre || !apellido || !email || !password || !sucursal_id) {
      return Response.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar que el email no exista
    const existingUser = await executeQuery("SELECT id FROM usuarios_sistema WHERE email = ?", [email])

    if (existingUser.length > 0) {
      return Response.json({ error: "Ya existe un usuario con este email" }, { status: 400 })
    }

    // Verificar que la sucursal exista
    const sucursal = await executeQuery("SELECT id, nombre FROM sucursales WHERE id = ? AND activa = TRUE", [
      sucursal_id,
    ])

    if (sucursal.length === 0) {
      return Response.json({ error: "Sucursal no encontrada o inactiva" }, { status: 400 })
    }

    // Encriptar contraseña
    const passwordHash = encryptPassword(password)

    // Crear administrador
    const insertQuery = `
      INSERT INTO usuarios_sistema (nombre, apellido, email, password_hash, rol, sucursal_id)
      VALUES (?, ?, ?, ?, 'admin_sucursal', ?)
    `

    const result = await executeQuery(insertQuery, [nombre, apellido, email, passwordHash, sucursal_id])

    // Obtener el administrador creado con información de sucursal
    const newAdmin = await executeQuery(
      `
      SELECT 
        us.id, us.nombre, us.apellido, us.email, us.rol, 
        us.sucursal_id, us.activo, us.fecha_creacion,
        s.nombre as sucursal_nombre
      FROM usuarios_sistema us
      LEFT JOIN sucursales s ON us.sucursal_id = s.id
      WHERE us.id = ?
    `,
      [result.insertId],
    )

    return Response.json({
      success: true,
      message: "Administrador creado correctamente",
      data: newAdmin[0],
    })
  } catch (error) {
    console.error("Error creando administrador:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
