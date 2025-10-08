import { query } from "@/lib/database"

export async function GET(request) {
  try {
    console.log("[v0] Obteniendo datos del dashboard super admin")

    // Métricas generales del sistema
    const metricas = await query(`
      SELECT 
        (SELECT COUNT(*) FROM sucursales WHERE activa = TRUE) as total_sucursales,
        (SELECT COUNT(*) FROM miembros WHERE activo = TRUE) as miembros_activos,
        (SELECT COALESCE(SUM(p.monto), 0) FROM pagos p 
         WHERE p.estado = 'pagado'
           AND MONTH(p.fecha_pago) = MONTH(CURDATE())
           AND YEAR(p.fecha_pago) = YEAR(CURDATE())) as ingresos_mensuales
    `)

    // Información de cada sucursal
    const sucursales = await query(`
      SELECT 
        s.id, s.nombre, s.direccion, s.activa,
        us.nombre as admin_nombre, us.apellido as admin_apellido,
        (SELECT COUNT(*) FROM miembros WHERE sucursal_id = s.id AND activo = TRUE) as miembros,
        (SELECT COALESCE(SUM(p.monto), 0) FROM pagos p 
         JOIN membresias mem ON p.membresia_id = mem.id 
         WHERE mem.sucursal_id = s.id 
           AND p.estado = 'pagado'
           AND MONTH(p.fecha_pago) = MONTH(CURDATE())
           AND YEAR(p.fecha_pago) = YEAR(CURDATE())) as ingresos
      FROM sucursales s
      LEFT JOIN usuarios_sistema us ON s.id = us.sucursal_id AND us.rol = 'admin_sucursal'
      ORDER BY s.nombre
    `)

    // Administradores recientes
    const administradores = await query(`
      SELECT 
        us.id, us.nombre, us.apellido, us.activo,
        s.nombre as sucursal_nombre
      FROM usuarios_sistema us
      LEFT JOIN sucursales s ON us.sucursal_id = s.id
      WHERE us.rol = 'admin_sucursal'
      ORDER BY us.fecha_creacion DESC
      LIMIT 4
    `)

    return Response.json({
      success: true,
      data: {
        metricas: metricas[0],
        sucursales,
        administradores,
      },
    })
  } catch (error) {
    console.error("Error obteniendo datos del dashboard super admin:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
