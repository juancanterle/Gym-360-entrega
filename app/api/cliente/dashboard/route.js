import { query } from "@/lib/database"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const miembroId = searchParams.get("miembro_id")

    if (!miembroId) {
      return Response.json({ error: "ID de miembro requerido" }, { status: 400 })
    }

    console.log("[v0] Obteniendo datos del dashboard para miembro:", miembroId)

    // Obtener información del miembro y su membresía
    const miembroData = await query(
      `
      SELECT 
        m.id, m.nombre, m.apellido, m.numero_miembro, m.email,
        s.nombre as sucursal_nombre, s.direccion as sucursal_direccion,
        mem.estado as membresia_estado, mem.fecha_inicio, mem.fecha_fin,
        p.nombre as plan_nombre, p.precio_mensual
      FROM miembros m
      LEFT JOIN sucursales s ON m.sucursal_id = s.id
      LEFT JOIN membresias mem ON m.id = mem.miembro_id AND mem.estado = 'activa'
      LEFT JOIN planes_membresia p ON mem.plan_id = p.id
      WHERE m.id = ? AND m.activo = TRUE
      LIMIT 1
    `,
      [miembroId],
    )

    if (miembroData.length === 0) {
      return Response.json({ error: "Miembro no encontrado" }, { status: 404 })
    }

    // Obtener próximas clases reservadas
    const proximasClases = await query(
      `
      SELECT 
        c.id, c.fecha, c.hora_inicio, c.hora_fin,
        tc.nombre as clase_nombre,
        e.nombre as entrenador_nombre, e.apellido as entrenador_apellido,
        ic.asistio,
        CASE 
          WHEN c.fecha = CURDATE() THEN 'Hoy'
          WHEN c.fecha = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 'Mañana'
          ELSE DATE_FORMAT(c.fecha, '%d/%m/%Y')
        END as fecha_texto
      FROM inscripciones_clases ic
      JOIN clases c ON ic.clase_id = c.id
      JOIN tipos_clases tc ON c.tipo_clase_id = tc.id
      JOIN entrenadores e ON c.entrenador_id = e.id
      WHERE ic.miembro_id = ? 
        AND c.fecha >= CURDATE()
        AND c.estado = 'programada'
      ORDER BY c.fecha, c.hora_inicio
      LIMIT 5
    `,
      [miembroId],
    )

    // Obtener historial de pagos
    const pagos = await query(
      `
      SELECT 
        p.id, p.monto, p.fecha_pago, p.fecha_vencimiento,
        p.metodo_pago, p.estado
      FROM pagos p
      JOIN membresias mem ON p.membresia_id = mem.id
      WHERE mem.miembro_id = ?
      ORDER BY p.fecha_pago DESC
      LIMIT 5
    `,
      [miembroId],
    )

    // Obtener estadísticas de asistencia del mes actual
    const estadisticas = await query(
      `
      SELECT 
        COUNT(*) as visitas_mes,
        (SELECT COUNT(*) FROM inscripciones_clases ic 
         JOIN clases c ON ic.clase_id = c.id 
         WHERE ic.miembro_id = ? 
           AND ic.asistio = TRUE 
           AND MONTH(c.fecha) = MONTH(CURDATE())
           AND YEAR(c.fecha) = YEAR(CURDATE())
        ) as clases_asistidas
      FROM asistencias
      WHERE miembro_id = ?
        AND MONTH(fecha_entrada) = MONTH(CURDATE())
        AND YEAR(fecha_entrada) = YEAR(CURDATE())
    `,
      [miembroId, miembroId],
    )

    return Response.json({
      success: true,
      data: {
        miembro: miembroData[0],
        proximasClases,
        pagos,
        estadisticas: estadisticas[0] || { visitas_mes: 0, clases_asistidas: 0 },
      },
    })
  } catch (error) {
    console.error("Error obteniendo datos del dashboard:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
