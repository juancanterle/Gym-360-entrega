"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, DollarSign, TrendingUp, Plus, Settings, Shield, Loader2 } from "lucide-react"
import { AdminManagement } from "./admin-management"

export function SuperAdminDashboard() {
  const [activeView, setActiveView] = useState<"dashboard" | "admins">("dashboard")
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("[v0] Cargando dashboard super admin")

        const response = await fetch("/api/super-admin/dashboard")
        const data = await response.json()

        if (data.success) {
          setDashboardData(data.data)
          console.log("[v0] Datos del dashboard super admin cargados:", data.data)
        } else {
          setError(data.error || "Error cargando datos")
        }
      } catch (err) {
        console.error("Error cargando dashboard super admin:", err)
        setError("Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    if (activeView === "dashboard") {
      fetchDashboardData()
    }
  }, [activeView])

  if (activeView === "admins") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveView("dashboard")}>
            ← Volver al Dashboard
          </Button>
        </div>
        <AdminManagement />
      </div>
    )
  }

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

  const { metricas, sucursales, administradores } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-balance">Panel de Control - Propietario</h1>
          <p className="text-muted-foreground">Gestión integral de todas las sucursales GYM360</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sucursal
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sucursales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.total_sucursales || 0}</div>
            <p className="text-xs text-muted-foreground">Sucursales activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.miembros_activos || 0}</div>
            <p className="text-xs text-muted-foreground">En todas las sucursales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(metricas.ingresos_mensuales || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total del mes actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">Crecimiento anual</p>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de Sucursales */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Sucursales</CardTitle>
          <CardDescription>Administra todas las sucursales y sus administradores</CardDescription>
        </CardHeader>
        <CardContent>
          {sucursales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay sucursales registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sucursales.map((sucursal: any) => (
                <div key={sucursal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">{sucursal.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        Admin:{" "}
                        {sucursal.admin_nombre ? `${sucursal.admin_nombre} ${sucursal.admin_apellido}` : "Sin asignar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{sucursal.miembros || 0}</p>
                      <p className="text-xs text-muted-foreground">Miembros</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">${Number(sucursal.ingresos || 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Ingresos</p>
                    </div>
                    <Badge variant={sucursal.activa ? "default" : "secondary"}>
                      {sucursal.activa ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Gestionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gestión de Administradores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestión de Administradores
          </CardTitle>
          <CardDescription>Crea y gestiona cuentas de administradores para cada sucursal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Administradores activos: {administradores.filter((a: any) => a.activo).length} de{" "}
                {metricas.total_sucursales} sucursales
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Desde aquí puedes crear, editar y gestionar todos los administradores del sistema
              </p>
            </div>
            <Button onClick={() => setActiveView("admins")}>
              <Shield className="h-4 w-4 mr-2" />
              Gestionar Administradores
            </Button>
          </div>

          {administradores.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Administradores Recientes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {administradores.map((admin: any) => (
                  <div key={admin.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <p className="text-sm font-medium">
                        {admin.nombre} {admin.apellido}
                      </p>
                      <p className="text-xs text-muted-foreground">Sucursal {admin.sucursal_nombre || "Sin asignar"}</p>
                    </div>
                    <Badge variant={admin.activo ? "default" : "secondary"} className="text-xs">
                      {admin.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}