const { executeQuery } = require("./database")
const crypto = require("crypto")

// Función para encriptar contraseñas con Base64 (como requiere el proyecto)
function encryptPassword(password) {
  return Buffer.from(password).toString("base64")
}

// Función para verificar contraseñas
function verifyPassword(password, hash) {
  const encrypted = Buffer.from(password).toString("base64")
  return encrypted === hash
}

// Autenticar usuario del sistema (administradores)
async function authenticateSystemUser(email, password) {
  try {
    const query = `
      SELECT us.*, s.nombre as sucursal_nombre 
      FROM usuarios_sistema us 
      LEFT JOIN sucursales s ON us.sucursal_id = s.id 
      WHERE us.email = ? AND us.activo = TRUE
    `

    const users = await executeQuery(query, [email])

    if (users.length === 0) {
      return null
    }

    const user = users[0]

    if (verifyPassword(password, user.password_hash)) {
      return {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        sucursal_id: user.sucursal_id,
        sucursal_nombre: user.sucursal_nombre,
        tipo: "sistema",
      }
    }

    return null
  } catch (error) {
    console.error("Error en autenticación de sistema:", error)
    return null
  }
}

// Autenticar miembro/cliente
async function authenticateMember(email, password) {
  try {
    const query = `
      SELECT um.*, m.nombre, m.apellido, m.numero_miembro, s.nombre as sucursal_nombre
      FROM usuarios_miembros um
      JOIN miembros m ON um.miembro_id = m.id
      JOIN sucursales s ON m.sucursal_id = s.id
      WHERE um.email = ? AND um.activo = TRUE AND m.activo = TRUE
    `

    const users = await executeQuery(query, [email])

    if (users.length === 0) {
      return null
    }

    const user = users[0]

    if (verifyPassword(password, user.password_hash)) {
      return {
        id: user.miembro_id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        numero_miembro: user.numero_miembro,
        sucursal_nombre: user.sucursal_nombre,
        tipo: "miembro",
      }
    }

    return null
  } catch (error) {
    console.error("Error en autenticación de miembro:", error)
    return null
  }
}

// Función principal de autenticación
async function authenticate(email, password) {
  // Primero intentar como usuario del sistema
  let user = await authenticateSystemUser(email, password)

  if (user) {
    return user
  }

  // Si no es usuario del sistema, intentar como miembro
  user = await authenticateMember(email, password)

  return user
}

// Crear nuevo administrador de sucursal
async function createSucursalAdmin(adminData) {
  try {
    const { nombre, apellido, email, password, sucursal_id } = adminData
    const passwordHash = encryptPassword(password)

    const query = `
      INSERT INTO usuarios_sistema (nombre, apellido, email, password_hash, rol, sucursal_id)
      VALUES (?, ?, ?, ?, 'admin_sucursal', ?)
    `

    const result = await executeQuery(query, [nombre, apellido, email, passwordHash, sucursal_id])
    return result.insertId
  } catch (error) {
    console.error("Error creando administrador:", error)
    throw error
  }
}

module.exports = {
  authenticate,
  authenticateSystemUser,
  authenticateMember,
  createSucursalAdmin,
  encryptPassword,
  verifyPassword,
}
