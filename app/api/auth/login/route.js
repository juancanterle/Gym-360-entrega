const { authenticate } = require("../../../../lib/auth")

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const user = await authenticate(email, password)

    if (!user) {
      return Response.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Determinar la ruta de redirección según el tipo de usuario
    let redirectUrl = "/dashboard"

    if (user.tipo === "sistema") {
      switch (user.rol) {
        case "super_admin":
          redirectUrl = "/dashboard/super-admin"
          break
        case "admin_sucursal":
          redirectUrl = "/dashboard/admin"
          break
        default:
          redirectUrl = "/dashboard"
      }
    } else if (user.tipo === "miembro") {
      redirectUrl = "/dashboard/cliente"
    }

    return Response.json({
      success: true,
      user: user,
      redirectUrl: redirectUrl,
    })
  } catch (error) {
    console.error("Error en login:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
