import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Building2, Dumbbell, Users } from "lucide-react"

export function DrillDownExplanation() {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Sistema de Drill Down / Drill Up (3 Niveles)
        </CardTitle>
        <CardDescription className="text-xs">
          Navegación jerárquica de datos desde lo general a lo específico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 font-medium">
            <Building2 className="h-3 w-3" />
            <span>Nivel 1: Todas las Sucursales</span>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Vista general con KPIs agregados</span>
        </div>
        <div className="flex items-center gap-2 text-sm pl-4">
          <div className="flex items-center gap-1 font-medium">
            <Dumbbell className="h-3 w-3" />
            <span>Nivel 2: Clases por Sucursal</span>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Ocupación y horarios de clases</span>
        </div>
        <div className="flex items-center gap-2 text-sm pl-8">
          <div className="flex items-center gap-1 font-medium">
            <Users className="h-3 w-3" />
            <span>Nivel 3: Miembros con Morosidad</span>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Detalle individual de miembros</span>
        </div>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          💡 <strong>Cómo usar:</strong> Haz clic en cualquier sucursal para expandir y ver sus clases. Luego haz clic
          en una clase para ver los miembros con problemas de pago.
        </p>
      </CardContent>
    </Card>
  )
}
