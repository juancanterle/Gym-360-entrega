import { query } from "@/lib/database"

export async function GET(request) {
  try {
    console.log("[v0] Obteniendo sucursales...")

    const sqlQuery = `
      SELECT id, nombre, direccion, capacidad_maxima, activa
      FROM sucursales 
      WHERE activa = TRUE
      ORDER BY nombre
    `

    const sucursales = await query(sqlQuery)

    console.log("[v0] Sucursales encontradas:", sucursales.length)

    return Response.json({
      success: true,
      data: sucursales,
    })
  } catch (error) {
    console.error("Error obteniendo sucursales:", error)
    return Response.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
