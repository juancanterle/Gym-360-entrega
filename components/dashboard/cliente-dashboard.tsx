"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Clock, MapPin, Loader2 } from "lucide-react"

export function ClienteDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
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
        console.log("[v0] Cargando dashboard para miembro:", user.id)

        const response = await fetch(`/api/cliente/dashboard?miembro_id=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setDashboardData(data.data)
          console.log("[v0] Datos del dashboard cargados:", data.data)
        } else {
          setError(data.error || "Error cargando datos")
        }
      } catch (err) {
        console.error("Error cargando dashboard:", err)
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
        <span className="ml-2">Cargando tu dashboard...</span>
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

  const { miembro, proximasClases, pagos, estadisticas } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Mi Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido {miembro.nombre} {miembro.apellido} - Miembro {miembro.numero_miembro}
        </p>
      </div>

      {/* Estado de Membresía */}
      <Card>
        <CardHeader>
          <CardTitle>Mi Membresía</CardTitle>
          <CardDescription>Estado actual de tu plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="default">{miembro.plan_nombre || "Plan Básico"}</Badge>
                <Badge variant={miembro.membresia_estado === "activa" ? "default" : "destructive"}>
                  {miembro.membresia_estado === "activa" ? "Activa" : "Inactiva"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Válida hasta: {miembro.fecha_fin ? new Date(miembro.fecha_fin).toLocaleDateString("es-ES") : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 inline mr-1" />
                {miembro.sucursal_nombre}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">${Number(miembro.precio_mensual || 0).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Mensual</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mis Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Próximas Clases</CardTitle>
          <CardDescription>Clases reservadas para esta semana</CardDescription>
        </CardHeader>
        <CardContent>
          {proximasClases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tienes clases reservadas</p>
              <Button className="mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                Reservar Nueva Clase
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {proximasClases.map((reserva: any) => (
                <div key={reserva.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">{reserva.clase_nombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        {reserva.fecha_texto} - {reserva.hora_inicio} | {reserva.entrenador_nombre}{" "}
                        {reserva.entrenador_apellido}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Confirmada</Badge>
                    <Button variant="outline" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservar Nueva Clase
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Pagos</CardTitle>
          <CardDescription>Historial y próximos vencimientos</CardDescription>
        </CardHeader>
        <CardContent>
          {pagos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay pagos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pagos.map((pago: any) => (
                <div key={pago.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{new Date(pago.fecha_pago).toLocaleDateString("es-ES")}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{pago.metodo_pago}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${Number(pago.monto || 0).toFixed(2)}</span>
                    <Badge variant={pago.estado === "pagado" ? "default" : "destructive"} className="capitalize">
                      {pago.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mi Actividad */}
      <Card>
        <CardHeader>
          <CardTitle>Mi Actividad</CardTitle>
          <CardDescription>Resumen de asistencias este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{estadisticas.visitas_mes}</p>
              <p className="text-sm text-muted-foreground">Visitas este mes</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{estadisticas.clases_asistidas}</p>
              <p className="text-sm text-muted-foreground">Clases asistidas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}