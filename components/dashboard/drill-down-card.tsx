"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Users, AlertTriangle, DollarSign, Loader2 } from "lucide-react"
import { StatusIndicator } from "./status-indicator"

interface DrillDownItem {
  id: number
  name: string
  members: number
  occupancy: number
  revenue: number
  status: string
  expiredMemberships?: number
  debt?: number
}

interface DrillDownCardProps {
  title: string
  description: string
  data: DrillDownItem[]
}

export function DrillDownCard({ title, description, data }: DrillDownCardProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [classesData, setClassesData] = useState<any[]>([])
  const [membersData, setMembersData] = useState<any[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)

  const handleItemClick = async (itemName: string, sucursalId: number) => {
    if (expandedItem === itemName) {
      setExpandedItem(null)
      setExpandedClass(null)
      return
    }

    setExpandedItem(itemName)
    setExpandedClass(null)

    // Cargar datos de clases para esta sucursal
    setLoadingClasses(true)
    try {
      const response = await fetch(`/api/dashboard/sucursales/${sucursalId}/clases`)
      const result = await response.json()

      if (result.success) {
        setClassesData(result.data)
      }
    } catch (error) {
      console.error("Error cargando clases:", error)
    } finally {
      setLoadingClasses(false)
    }
  }

  const handleClassClick = async (className: string, sucursalId: number) => {
    if (expandedClass === className) {
      setExpandedClass(null)
      return
    }

    setExpandedClass(className)

    // Cargar datos de miembros morosos para esta sucursal
    setLoadingMembers(true)
    try {
      const response = await fetch(`/api/dashboard/sucursales/${sucursalId}/miembros?filtro=morosos`)
      const result = await response.json()

      if (result.success) {
        setMembersData(result.data)
      }
    } catch (error) {
      console.error("Error cargando miembros:", error)
    } finally {
      setLoadingMembers(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <StatusIndicator status="success" size="sm" />
            <span>Óptimo &gt;80%</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIndicator status="warning" size="sm" />
            <span>Atención 60-80%</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIndicator status="danger" size="sm" />
            <span>Crítico &lt;60%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.id} className="border rounded-lg">
              {/* NIVEL 1 - Sucursales */}
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto drill-down-item"
                onClick={() => handleItemClick(item.name, item.id)}
              >
                <div className="flex items-center space-x-3">
                  <StatusIndicator status={item.status as "success" | "warning" | "danger"} />
                  <div className="text-left">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.members} miembros activos
                      </span>
                      <span>{item.occupancy}% ocupación</span>
                      {item.expiredMemberships && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="h-3 w-3" />
                          {item.expiredMemberships} vencidas
                        </span>
                      )}
                      {item.debt && (
                        <span className="flex items-center gap-1 text-red-600">
                          <DollarSign className="h-3 w-3" />${item.debt.toLocaleString()} deuda
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${item.revenue.toLocaleString()}</span>
                  {expandedItem === item.name ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </Button>

              {/* NIVEL 2 - Clases/Planes por Sucursal */}
              {expandedItem === item.name && (
                <div className="border-t bg-muted/30 p-4">
                  <h5 className="font-medium mb-3">Ocupación de Clases - {item.name}</h5>

                  {loadingClasses ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Cargando clases...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {classesData.map((classItem) => (
                        <div key={classItem.tipo_clase_id} className="border rounded bg-background">
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-3 h-auto"
                            onClick={() => handleClassClick(classItem.tipo_clase, item.id)}
                          >
                            <div className="flex items-center space-x-2">
                              <StatusIndicator status={classItem.estado_ocupacion} size="sm" />
                              <div className="text-left">
                                <p className="font-medium text-sm">{classItem.tipo_clase}</p>
                                <p className="text-xs text-muted-foreground">
                                  {classItem.entrenador_principal || "Sin entrenador"} •
                                  {classItem.horario_popular || "Sin horario"} •{classItem.promedio_inscritos}/
                                  {classItem.promedio_capacidad} personas
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{classItem.ocupacion_promedio}%</span>
                              {expandedClass === classItem.tipo_clase ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </div>
                          </Button>

                          {/* NIVEL 3 - Miembros con Problemas */}
                          {expandedClass === classItem.tipo_clase && (
                            <div className="border-t bg-muted/50 p-3">
                              <h6 className="font-medium text-sm mb-2">Miembros con Morosidad</h6>

                              {loadingMembers ? (
                                <div className="flex items-center justify-center py-2">
                                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                  <span className="text-xs">Cargando miembros...</span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {membersData.slice(0, 5).map((member) => (
                                    <div
                                      key={member.id}
                                      className="flex justify-between items-center p-2 bg-background rounded text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <StatusIndicator status={member.estados.morosidad} size="sm" />
                                        <div>
                                          <p className="font-medium">
                                            {member.nombre} {member.apellido}
                                          </p>
                                          <p className="text-muted-foreground">
                                            {member.plan_nombre} • {member.dias_mora} días mora
                                          </p>
                                          <p className="text-muted-foreground">{member.telefono}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium text-red-600">
                                          ${member.deuda_total.toLocaleString()}
                                        </p>
                                        <p className="text-muted-foreground">deuda</p>
                                      </div>
                                    </div>
                                  ))}
                                  {membersData.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-2">
                                      No hay miembros morosos en esta sucursal
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {classesData.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No hay clases programadas para esta sucursal
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
