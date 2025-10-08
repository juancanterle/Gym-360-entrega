const { executeQuery } = require("../../../../lib/database")
const { encryptPassword } = require("../../../../lib/auth")

// PUT - Actualizar administrador
export async function PUT(request, { params }) {
  try {
    const adminId = params.id
    const { nombre, apellido, email, password, sucursal_id, activo } = await request.json()

    if (!nombre || !apellido || !email || !sucursal_id) {
      return Response.json({ error: "Nombre, apellido, email y sucursal son requeridos" }, { status: 400 })
    }

    // Verificar que el administrador existe
    const existingAdmin = await executeQuery(
      'SELECT id FROM usuarios_sistema WHERE id = ? AND rol = "admin_sucursal"',
      [adminId],
    )

    if (existingAdmin.length === 0) {
      return Response.json({ error: "Administrador no encontrado" }, { status: 404 })
    }

    // Verificar que el email no esté en uso por otro usuario
    const emailCheck = await executeQuery("SELECT id FROM usuarios_sistema WHERE email = ? AND id != ?", [
      email,
      adminId,
    ])

    if (emailCheck.length > 0) {
      return Response.json({ error: "Ya existe otro usuario con este email" }, { status: 400 })
    }

    // Verificar que la sucursal exista
    const sucursal = await executeQuery("SELECT id FROM sucursales WHERE id = ? AND activa = TRUE", [sucursal_id])

    if (sucursal.length === 0) {
      return Response.json({ error: "Sucursal no encontrada o inactiva" }, { status: 400 })
    }

    // Preparar query de actualización
    let updateQuery = `
      UPDATE usuarios_sistema 
      SET nombre = ?, apellido = ?, email = ?, sucursal_id = ?, activo = ?
    `
    const queryParams = [nombre, apellido, email, sucursal_id, activo !== undefined ? activo : true]

    // Si se proporciona nueva contraseña, incluirla
    if (password && password.trim() !== "") {
      const passwordHash = encryptPassword(password)
      updateQuery += ", password_hash = ?"
      queryParams.push(passwordHash)
    }

    updateQuery += " WHERE id = ?"
    queryParams.push(adminId)

    await executeQuery(updateQuery, queryParams)

    // Obtener el administrador actualizado
    const updatedAdmin = await executeQuery(
      `
      SELECT 
        us.id, us.nombre, us.apellido, us.email, us.rol, 
        us.sucursal_id, us.activo, us.fecha_creacion,
        s.nombre as sucursal_nombre
      FROM usuarios_sistema us
      LEFT JOIN sucursales s ON us.sucursal_id = s.id
      WHERE us.id = ?
    `,
      [adminId],
    )

    return Response.json({
      success: true,
      message: "Administrador actualizado correctamente",
      data: updatedAdmin[0],
    })
  } catch (error) {
    console.error("Error actualizando administrador:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar administrador
export async function DELETE(request, { params }) {
  try {
    const adminId = params.id

    // Verificar que el administrador existe
    const existingAdmin = await executeQuery(
      'SELECT id, nombre, apellido FROM usuarios_sistema WHERE id = ? AND rol = "admin_sucursal"',
      [adminId],
    )

    if (existingAdmin.length === 0) {
      return Response.json({ error: "Administrador no encontrado" }, { status: 404 })
    }

    // En lugar de eliminar físicamente, desactivar el usuario
    await executeQuery("UPDATE usuarios_sistema SET activo = FALSE WHERE id = ?", [adminId])

    return Response.json({
      success: true,
      message: `Administrador ${existingAdmin[0].nombre} ${existingAdmin[0].apellido} desactivado correctamente`,
    })
  } catch (error) {
    console.error("Error eliminando administrador:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
