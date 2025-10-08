const { executeQuery } = require("../../../../lib/database")

export async function GET(request) {
  try {
    const query = `
      SELECT 
        s.id,
        s.nombre,
        s.direccion,
        s.capacidad_maxima,
        
        -- Miembros activos
        COUNT(DISTINCT CASE WHEN m.activo = TRUE THEN m.id END) as miembros_activos,
        
        -- Membresías vencidas
        COUNT(DISTINCT CASE WHEN mem.estado = 'vencida' THEN mem.id END) as membresias_vencidas,
        
        -- Deuda total
        COALESCE(SUM(CASE WHEN p.estado = 'vencido' THEN p.monto ELSE 0 END), 0) as deuda_total,
        
        -- Ocupación promedio de clases
        COALESCE(AVG(CASE WHEN c.fecha >= CURDATE() - INTERVAL 30 DAY 
                     THEN (c.inscritos_actuales / c.capacidad_maxima) * 100 
                     ELSE NULL END), 0) as ocupacion_promedio,
        
        -- Ingresos del mes
        COALESCE(SUM(CASE WHEN p.estado = 'pagado' AND p.fecha_pago >= CURDATE() - INTERVAL 30 DAY 
                     THEN p.monto ELSE 0 END), 0) as ingresos_mes,
        
        -- Clases programadas hoy
        COUNT(DISTINCT CASE WHEN c.fecha = CURDATE() THEN c.id END) as clases_hoy
        
      FROM sucursales s
      LEFT JOIN miembros m ON s.id = m.sucursal_id
      LEFT JOIN membresias mem ON s.id = mem.sucursal_id
      LEFT JOIN pagos p ON mem.id = p.membresia_id
      LEFT JOIN clases c ON s.id = c.sucursal_id
      WHERE s.activa = TRUE
      GROUP BY s.id, s.nombre, s.direccion, s.capacidad_maxima
      ORDER BY s.nombre
    `

    const sucursales = await executeQuery(query)

    // Calcular estados de semaforización
    const sucursalesConEstado = sucursales.map((sucursal) => {
      // Estado de ocupación
      let estadoOcupacion = "success" // Verde
      if (sucursal.ocupacion_promedio < 50) {
        estadoOcupacion = "destructive" // Rojo
      } else if (sucursal.ocupacion_promedio < 75) {
        estadoOcupacion = "warning" // Amarillo
      }

      // Estado de morosidad
      let estadoMorosidad = "success"
      if (sucursal.deuda_total > 50000) {
        estadoMorosidad = "destructive"
      } else if (sucursal.deuda_total > 20000) {
        estadoMorosidad = "warning"
      }

      // Estado de membresías
      let estadoMembresias = "success"
      if (sucursal.membresias_vencidas > 20) {
        estadoMembresias = "destructive"
      } else if (sucursal.membresias_vencidas > 10) {
        estadoMembresias = "warning"
      }

      return {
        ...sucursal,
        ocupacion_promedio: Math.round(sucursal.ocupacion_promedio),
        deuda_total: Number.parseFloat(sucursal.deuda_total),
        ingresos_mes: Number.parseFloat(sucursal.ingresos_mes),
        estados: {
          ocupacion: estadoOcupacion,
          morosidad: estadoMorosidad,
          membresias: estadoMembresias,
        },
      }
    })

    return Response.json({
      success: true,
      data: sucursalesConEstado,
    })
  } catch (error) {
    console.error("Error obteniendo KPIs de sucursales:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
