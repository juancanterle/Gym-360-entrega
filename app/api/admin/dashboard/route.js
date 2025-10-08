import { query } from "@/lib/database"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sucursalId = searchParams.get("sucursal_id")

    if (!sucursalId) {
      return Response.json({ error: "ID de sucursal requerido" }, { status: 400 })
    }

    console.log("[v0] Obteniendo datos del dashboard para sucursal:", sucursalId)

    // Métricas generales de la sucursal
    const metricas = await query(
      `
      SELECT 
        (SELECT COUNT(*) FROM miembros WHERE sucursal_id = ? AND activo = TRUE) as miembros_activos,
        (SELECT COUNT(*) FROM miembros WHERE sucursal_id = ? AND activo = TRUE 
         AND fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as nuevos_semana,
        (SELECT COALESCE(SUM(p.monto), 0) FROM pagos p 
         JOIN membresias mem ON p.membresia_id = mem.id 
         WHERE mem.sucursal_id = ? 
           AND p.estado = 'pagado'
           AND MONTH(p.fecha_pago) = MONTH(CURDATE())
           AND YEAR(p.fecha_pago) = YEAR(CURDATE())) as ingresos_mes,
        (SELECT COUNT(*) FROM clases WHERE sucursal_id = ? AND fecha = CURDATE()) as clases_hoy,
        (SELECT COUNT(*) FROM pagos p 
         JOIN membresias mem ON p.membresia_id = mem.id 
         WHERE mem.sucursal_id = ? AND p.estado = 'pendiente') as pagos_pendientes,
        (SELECT COUNT(*) FROM pagos p 
         JOIN membresias mem ON p.membresia_id = mem.id 
         WHERE mem.sucursal_id = ? AND p.estado = 'vencido') as pagos_vencidos
    `,
      [sucursalId, sucursalId, sucursalId, sucursalId, sucursalId, sucursalId],
    )

    // Clases de hoy con ocupación
    const clasesHoy = await query(
      `
      SELECT 
        c.id, c.hora_inicio, c.capacidad_maxima, c.inscritos_actuales,
        tc.nombre as clase_nombre,
        ROUND((c.inscritos_actuales / c.capacidad_maxima) * 100) as porcentaje_ocupacion
      FROM clases c
      JOIN tipos_clases tc ON c.tipo_clase_id = tc.id
      WHERE c.sucursal_id = ? 
        AND c.fecha = CURDATE()
        AND c.estado = 'programada'
      ORDER BY c.hora_inicio
    `,
      [sucursalId],
    )

    return Response.json({
      success: true,
      data: {
        metricas: metricas[0],
        clasesHoy,
      },
    })
  } catch (error) {
    console.error("Error obteniendo datos del dashboard admin:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
