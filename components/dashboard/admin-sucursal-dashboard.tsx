"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Calendar, AlertTriangle, Loader2 } from "lucide-react"
import { SemaforizacionLegend } from "./semaforizacion-legend"

interface Metricas {
  miembros_activos: number
  nuevos_semana: number
  ingresos_mes: number
  clases_hoy: number
  pagos_pendientes: number
  pagos_vencidos: number
}

interface ClaseHoy {
  id: number
  clase_nombre: string
  hora_inicio: string
  capacidad_maxima: number
  inscritos_actuales: number
}

interface DashboardData {
  metricas: Metricas
  clasesHoy: ClaseHoy[]
}

export function AdminSucursalDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem("gym360_user")
        if (!userStr) {
          setError("No se encontró información del usuario")
          return
        }

        const user = JSON.parse(userStr)
        console.log("[v0] Cargando dashboard para sucursal:", user.sucursal_id)

        const response = await fetch(`/api/admin/dashboard?sucursal_id=${user.sucursal_id}`)
        const data = await response.json()

        if (data.success) {
          setDashboardData(data.data)
          console.log("[v0] Datos del dashboard admin cargados:", data.data)
        } else {
          setError(data.error || "Error cargando datos")
        }
      } catch (err) {
        console.error("Error cargando dashboard admin:", err)
        setError("Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando dashboard...</span>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "No se pudieron cargar los datos"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const { metricas, clasesHoy } = dashboardData
  const userStr = localStorage.getItem("gym360_user")
  const user = userStr ? JSON.parse(userStr) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard - {user?.sucursal_nombre || "Sucursal"}</h1>
        <p className="text-muted-foreground">Gestión y métricas de tu sucursal</p>
      </div>

      {/* Métricas de Sucursal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.miembros_activos}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{metricas.nuevos_semana}</span> nuevos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(metricas.ingresos_mes || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pagos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.clases_hoy}</div>
            <p className="text-xs text-muted-foreground">Programadas para hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.pagos_pendientes}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{metricas.pagos_vencidos}</span> vencidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ocupación de Clases */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ocupación de Clases - Hoy</CardTitle>
              <CardDescription>Estado actual de las clases programadas</CardDescription>
            </CardHeader>
            <CardContent>
              {clasesHoy.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay clases programadas para hoy</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clasesHoy.map((clase) => {
                    const porcentaje =
                      clase.capacidad_maxima > 0
                        ? Math.round((clase.inscritos_actuales / clase.capacidad_maxima) * 100)
                        : 0
                    const estado = porcentaje >= 90 ? "rojo" : porcentaje >= 70 ? "amarillo" : "verde"

                    return (
                      <div key={clase.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              estado === "verde"
                                ? "bg-green-500"
                                : estado === "amarillo"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <div>
                            <h4 className="font-medium">{clase.clase_nombre}</h4>
                            <p className="text-sm text-muted-foreground">{clase.hora_inicio}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {clase.inscritos_actuales}/{clase.capacidad_maxima}
                          </p>
                          <p className="text-xs text-muted-foreground">{porcentaje}% ocupación</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <SemaforizacionLegend />
      </div>
    </div>
  )
}

