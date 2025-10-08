const { executeQuery } = require("../../../../../../lib/database")

export async function GET(request, { params }) {
  try {
    const sucursalId = params.id

    const query = `
      SELECT 
        tc.id as tipo_clase_id,
        tc.nombre as tipo_clase,
        tc.descripcion,
        tc.duracion_minutos,
        
        -- Estadísticas de ocupación
        COUNT(c.id) as total_clases,
        AVG(c.inscritos_actuales) as promedio_inscritos,
        AVG(c.capacidad_maxima) as promedio_capacidad,
        AVG((c.inscritos_actuales / c.capacidad_maxima) * 100) as ocupacion_promedio,
        
        -- Clases de esta semana
        COUNT(CASE WHEN c.fecha >= CURDATE() - INTERVAL 7 DAY THEN 1 END) as clases_semana,
        
        -- Entrenador más frecuente
        (SELECT CONCAT(e.nombre, ' ', e.apellido) 
         FROM clases c2 
         JOIN entrenadores e ON c2.entrenador_id = e.id 
         WHERE c2.tipo_clase_id = tc.id AND c2.sucursal_id = ?
         GROUP BY e.id 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as entrenador_principal,
         
        -- Horario más popular
        (SELECT TIME_FORMAT(c2.hora_inicio, '%H:%i') 
         FROM clases c2 
         WHERE c2.tipo_clase_id = tc.id AND c2.sucursal_id = ?
         GROUP BY c2.hora_inicio 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as horario_popular
        
      FROM tipos_clases tc
      LEFT JOIN clases c ON tc.id = c.tipo_clase_id AND c.sucursal_id = ?
      WHERE tc.activo = TRUE
      GROUP BY tc.id, tc.nombre, tc.descripcion, tc.duracion_minutos
      HAVING total_clases > 0
      ORDER BY ocupacion_promedio DESC
    `

    const clases = await executeQuery(query, [sucursalId, sucursalId, sucursalId])

    // Obtener información de la sucursal
    const sucursalQuery = `SELECT nombre FROM sucursales WHERE id = ?`
    const sucursalInfo = await executeQuery(sucursalQuery, [sucursalId])

    // Calcular estados de semaforización para cada clase
    const clasesConEstado = clases.map((clase) => {
      let estadoOcupacion = "success"
      if (clase.ocupacion_promedio < 50) {
        estadoOcupacion = "destructive"
      } else if (clase.ocupacion_promedio < 75) {
        estadoOcupacion = "warning"
      }

      return {
        ...clase,
        ocupacion_promedio: Math.round(clase.ocupacion_promedio || 0),
        promedio_inscritos: Math.round(clase.promedio_inscritos || 0),
        promedio_capacidad: Math.round(clase.promedio_capacidad || 0),
        estado_ocupacion: estadoOcupacion,
      }
    })

    return Response.json({
      success: true,
      sucursal: sucursalInfo[0]?.nombre || "Sucursal no encontrada",
      data: clasesConEstado,
    })
  } catch (error) {
    console.error("Error obteniendo clases de sucursal:", error)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
