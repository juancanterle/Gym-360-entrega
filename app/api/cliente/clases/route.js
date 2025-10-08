import { query } from "@/lib/database"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sucursalId = searchParams.get("sucursal_id")

    if (!sucursalId) {
      return Response.json({ error: "ID de sucursal requerido" }, { status: 400 })
    }

    console.log("[v0] Obteniendo clases disponibles para sucursal:", sucursalId)

    // Obtener clases disponibles de la sucursal
    const clases = await query(
      `
      SELECT 
        c.id, c.fecha, c.hora_inicio, c.hora_fin, 
        c.capacidad_maxima, c.inscritos_actuales,
        tc.nombre as clase_nombre, tc.descripcion, tc.duracion_minutos,
        e.nombre as entrenador_nombre, e.apellido as entrenador_apellido,
        CASE 
          WHEN c.fecha = CURDATE() THEN 'Hoy'
          WHEN c.fecha = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 'Mañana'
          ELSE DATE_FORMAT(c.fecha, '%W %d/%m')
        END as fecha_texto,
        (c.capacidad_maxima - c.inscritos_actuales) as cupos_disponibles
      FROM clases c
      JOIN tipos_clases tc ON c.tipo_clase_id = tc.id
      JOIN entrenadores e ON c.entrenador_id = e.id
      WHERE c.sucursal_id = ? 
        AND c.fecha >= CURDATE()
        AND c.estado = 'programada'
      ORDER BY c.fecha, c.hora_inicio
      LIMIT 20
    `,
      [sucursalId],
    )

    return Response.json({
      success: true,
      data: clases,
    })
  } catch (error) {
    console.error("Error obteniendo clases:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
