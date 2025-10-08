const { executeQuery } = require("../../../../../../lib/database")

export async function GET(request, { params }) {
  try {
    const sucursalId = params.id
    const { searchParams } = new URL(request.url)
    const filtro = searchParams.get("filtro") || "todos" // todos, morosos, riesgo

    let whereCondition = ""
    let orderBy = "m.apellido, m.nombre"

    switch (filtro) {
      case "morosos":
        whereCondition = 'AND p.estado = "vencido"'
        orderBy = "dias_mora DESC, deuda_total DESC"
        break
      case "riesgo":
        whereCondition =
          "AND (mem.fecha_fin <= CURDATE() + INTERVAL 30 DAY OR p.fecha_vencimiento <= CURDATE() + INTERVAL 7 DAY)"
        orderBy = "riesgo_score DESC"
        break
    }

    const query = `
      SELECT 
        m.id,
        m.numero_miembro,
        m.nombre,
        m.apellido,
        m.email,
        m.telefono,
        m.fecha_registro,
        
        -- Información de membresía
        mem.estado as estado_membresia,
        mem.fecha_inicio,
        mem.fecha_fin,
        pm.nombre as plan_nombre,
        mem.precio_pagado,
        
        -- Información de pagos y deuda
        COALESCE(SUM(CASE WHEN p.estado = 'vencido' THEN p.monto ELSE 0 END), 0) as deuda_total,
        COUNT(CASE WHEN p.estado = 'vencido' THEN 1 END) as pagos_vencidos,
        
        -- Días de mora (del pago más antiguo vencido)
        COALESCE(MAX(CASE WHEN p.estado = 'vencido' 
                     THEN DATEDIFF(CURDATE(), p.fecha_vencimiento) 
                     ELSE 0 END), 0) as dias_mora,
        
        -- Último pago
        MAX(CASE WHEN p.estado = 'pagado' THEN p.fecha_pago END) as ultimo_pago,
        
        -- Asistencias del mes
        COUNT(DISTINCT CASE WHEN a.fecha_entrada >= CURDATE() - INTERVAL 30 DAY 
                       THEN a.id END) as asistencias_mes,
        
        -- Score de riesgo (combinación de factores)
        (
          CASE WHEN mem.fecha_fin <= CURDATE() THEN 100
               WHEN mem.fecha_fin <= CURDATE() + INTERVAL 7 DAY THEN 80
               WHEN mem.fecha_fin <= CURDATE() + INTERVAL 30 DAY THEN 60
               ELSE 0 END +
          CASE WHEN p.estado = 'vencido' THEN 
                    LEAST(DATEDIFF(CURDATE(), p.fecha_vencimiento) * 2, 50)
               ELSE 0 END +
          CASE WHEN COUNT(DISTINCT CASE WHEN a.fecha_entrada >= CURDATE() - INTERVAL 30 DAY 
                                   THEN a.id END) = 0 THEN 30
               WHEN COUNT(DISTINCT CASE WHEN a.fecha_entrada >= CURDATE() - INTERVAL 30 DAY 
                                   THEN a.id END) < 5 THEN 15
               ELSE 0 END
        ) as riesgo_score
        
      FROM miembros m
      LEFT JOIN membresias mem ON m.id = mem.miembro_id AND mem.estado IN ('activa', 'vencida')
      LEFT JOIN planes_membresia pm ON mem.plan_id = pm.id
      LEFT JOIN pagos p ON mem.id = p.membresia_id
      LEFT JOIN asistencias a ON m.id = a.miembro_id
      WHERE m.sucursal_id = ? AND m.activo = TRUE ${whereCondition}
      GROUP BY m.id, m.numero_miembro, m.nombre, m.apellido, m.email, m.telefono, 
               m.fecha_registro, mem.estado, mem.fecha_inicio, mem.fecha_fin, 
               pm.nombre, mem.precio_pagado
      ORDER BY ${orderBy}
      LIMIT 50
    `

    const miembros = await executeQuery(query, [sucursalId])

    // Obtener información de la sucursal
    const sucursalQuery = `SELECT nombre FROM sucursales WHERE id = ?`
    const sucursalInfo = await executeQuery(sucursalQuery, [sucursalId])

    // Calcular estados para cada miembro
    const miembrosConEstado = miembros.map((miembro) => {
      let estadoGeneral = "success"
      let estadoMorosidad = "success"
      let estadoMembresia = "success"

      // Estado de morosidad
      if (miembro.dias_mora > 30) {
        estadoMorosidad = "destructive"
        estadoGeneral = "destructive"
      } else if (miembro.dias_mora > 7) {
        estadoMorosidad = "warning"
        if (estadoGeneral === "success") estadoGeneral = "warning"
      }

      // Estado de membresía
      const diasParaVencer = Math.ceil((new Date(miembro.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24))
      if (diasParaVencer < 0) {
        estadoMembresia = "destructive"
        estadoGeneral = "destructive"
      } else if (diasParaVencer <= 7) {
        estadoMembresia = "warning"
        if (estadoGeneral === "success") estadoGeneral = "warning"
      }

      return {
        ...miembro,
        deuda_total: Number.parseFloat(miembro.deuda_total),
        dias_para_vencer: diasParaVencer,
        estados: {
          general: estadoGeneral,
          morosidad: estadoMorosidad,
          membresia: estadoMembresia,
        },
      }
    })

    return Response.json({
      success: true,
      sucursal: sucursalInfo[0]?.nombre || "Sucursal no encontrada",
      filtro: filtro,
      data: miembrosConEstado,
    })
  } catch (error) {
    console.error("Error obteniendo miembros de sucursal:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
