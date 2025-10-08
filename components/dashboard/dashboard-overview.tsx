"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "./metric-card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { StatusIndicator } from "./status-indicator"
import { DrillDownCard } from "./drill-down-card"
import { Loader2 } from "lucide-react"

export function DashboardOverview() {
  const [sucursalesData, setSucursalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSucursalesData()
  }, [])

  const fetchSucursalesData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/sucursales")
      const result = await response.json()

      if (result.success) {
        setSucursalesData(result.data)
      } else {
        setError("Error cargando datos de sucursales")
      }
    } catch (err) {
      console.error("Error fetching sucursales:", err)
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Calcular métricas globales desde los datos reales
  const calculateGlobalMetrics = () => {
    if (sucursalesData.length === 0)
      return {
        totalMiembros: 0,
        ingresosTotales: 0,
        ocupacionPromedio: 0,
        deudaTotal: 0,
      }

    const totalMiembros = sucursalesData.reduce((sum, s) => sum + s.miembros_activos, 0)
    const ingresosTotales = sucursalesData.reduce((sum, s) => sum + s.ingresos_mes, 0)
    const ocupacionPromedio = sucursalesData.reduce((sum, s) => sum + s.ocupacion_promedio, 0) / sucursalesData.length
    const deudaTotal = sucursalesData.reduce((sum, s) => sum + s.deuda_total, 0)

    return { totalMiembros, ingresosTotales, ocupacionPromedio, deudaTotal }
  }

  const metrics = calculateGlobalMetrics()

  // Preparar datos para gráficos
  const chartData = sucursalesData.map((s) => ({
    name: s.nombre.replace("Sucursal ", ""),
    miembros: s.miembros_activos,
    ocupacion: s.ocupacion_promedio,
    ingresos: s.ingresos_mes / 1000, // En miles
    deuda: s.deuda_total / 1000,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <button
          onClick={fetchSucursalesData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Miembros Activos"
          value={metrics.totalMiembros.toString()}
          change="+12.5%"
          trend="up"
          description="vs mes anterior"
        />
        <MetricCard
          title="Ingresos Mensuales"
          value={`$${metrics.ingresosTotales.toLocaleString()}`}
          change="+8.2%"
          trend="up"
          description="vs mes anterior"
        />
        <MetricCard
          title="Ocupación Promedio"
          value={`${Math.round(metrics.ocupacionPromedio)}%`}
          change="-2.1%"
          trend="down"
          description="vs mes anterior"
        />
        <MetricCard
          title="Deuda Total"
          value={`$${metrics.deudaTotal.toLocaleString()}`}
          change="+5.3%"
          trend="up"
          description="vs mes anterior"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Miembros por Sucursal */}
        <Card>
          <CardHeader>
            <CardTitle>Miembros por Sucursal</CardTitle>
            <CardDescription>Distribución de miembros activos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                miembros: { label: "Miembros", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="miembros" fill="var(--color-chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ocupación por Sucursal */}
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Sucursal</CardTitle>
            <CardDescription>Porcentaje de ocupación promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ocupacion: { label: "Ocupación", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ocupacion" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Drill-down Section */}
      <DrillDownCard
        title="Vista Dashboard General - KPIs por Sucursal"
        description="Nivel 1: Haz clic en una sucursal → Nivel 2: Ver clases → Nivel 3: Miembros con morosidad"
        data={sucursalesData.map((s) => ({
          id: s.id,
          name: s.nombre,
          members: s.miembros_activos,
          occupancy: s.ocupacion_promedio,
          revenue: s.ingresos_mes,
          status: s.estados.ocupacion,
          expiredMemberships: s.membresias_vencidas,
          debt: s.deuda_total,
        }))}
      />

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Sucursales</CardTitle>
          <CardDescription>Indicadores de rendimiento en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sucursalesData.map((branch) => (
              <div key={branch.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <StatusIndicator status={branch.estados.ocupacion} />
                  <div>
                    <h4 className="font-medium">{branch.nombre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {branch.miembros_activos} miembros • {branch.ocupacion_promedio}% ocupación
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${branch.ingresos_mes.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ingresos mensuales</p>
                  {branch.deuda_total > 0 && (
                    <p className="text-sm text-red-500">Deuda: ${branch.deuda_total.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
