import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request) {
  try {
    const { nombre, apellido, email, telefono, password, sucursal_id } = await request.json()

    console.log("[v0] Datos recibidos para registro:", {
      nombre,
      apellido,
      email,
      sucursal_id,
      tipo: typeof sucursal_id,
    })

    if (!sucursal_id || sucursal_id === "" || sucursal_id === "undefined") {
      return NextResponse.json({
        success: false,
        error: "Debe seleccionar una sucursal",
      })
    }

    const sucursalIdNum = Number.parseInt(sucursal_id, 10)
    if (isNaN(sucursalIdNum)) {
      return NextResponse.json({
        success: false,
        error: "ID de sucursal inválido",
      })
    }

    console.log("[v0] Sucursal ID convertido:", sucursalIdNum)

    // Verificar si el email ya existe en usuarios_miembros (no en miembros)
    const existingUser = await query("SELECT id FROM usuarios_miembros WHERE email = ?", [email])
    if (existingUser.length > 0) {
      return NextResponse.json({
        success: false,
        error: "El email ya está registrado",
      })
    }

    // Verificar que la sucursal exista y esté activa
    const sucursalExists = await query("SELECT id, nombre FROM sucursales WHERE id = ? AND activa = TRUE", [
      sucursalIdNum,
    ])
    if (sucursalExists.length === 0) {
      return NextResponse.json({
        success: false,
        error: "La sucursal seleccionada no está disponible",
      })
    }

    console.log("[v0] Sucursal verificada:", sucursalExists[0].nombre)

    const lastMiembro = await query("SELECT MAX(id) as max_id FROM miembros")
    const nextId = (lastMiembro[0]?.max_id || 0) + 1
    const numeroMiembro = `M${String(nextId).padStart(6, "0")}`

    console.log("[v0] Generando número de miembro:", numeroMiembro)

    const result = await query(
      `INSERT INTO miembros (numero_miembro, nombre, apellido, email, telefono, fecha_registro, activo, sucursal_id) 
       VALUES (?, ?, ?, ?, ?, NOW(), TRUE, ?)`,
      [numeroMiembro, nombre, apellido, email, telefono, sucursalIdNum],
    )

    const nuevoMiembroId = result.insertId
    console.log("[v0] Miembro insertado con ID:", nuevoMiembroId)

    // Encriptar contraseña en Base64
    const passwordHash = Buffer.from(password).toString("base64")

    // Guardar usuario de login en usuarios_miembros
    await query(`INSERT INTO usuarios_miembros (miembro_id, email, password_hash) VALUES (?, ?, ?)`, [
      nuevoMiembroId,
      email,
      passwordHash,
    ])

    const planInfo = await query("SELECT precio_mensual FROM planes_membresia WHERE id = 1")
    const precioPlan = planInfo[0]?.precio_mensual || 0

    // Crear membresía inicial (plan_id fijo = 1)
    await query(
      `INSERT INTO membresias (miembro_id, plan_id, sucursal_id, fecha_inicio, fecha_fin, precio_pagado, estado) 
       VALUES (?, 1, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), ?, 'activa')`,
      [nuevoMiembroId, sucursalIdNum, precioPlan],
    )

    const user = {
      id: nuevoMiembroId,
      nombre,
      apellido,
      email,
      tipo: "cliente",
      sucursal_id: sucursalIdNum,
      sucursal_nombre: sucursalExists[0].nombre,
    }

    console.log("[v0] Registro exitoso para usuario:", user.email)

    return NextResponse.json({
      success: true,
      user,
      redirectUrl: "/dashboard/cliente",
    })
  } catch (error) {
    console.error("[v0] Error en registro:", error)
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor: " + error.message,
    })
  }
}