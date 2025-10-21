import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "./status-indicator"

export function SemaforizacionLegend() {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-sm">Leyenda de Indicadores (Semaforización)</CardTitle>
        <CardDescription className="text-xs">Sistema de 3 estados para evaluación de métricas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <StatusIndicator status="success" size="md" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Verde - Óptimo</p>
            <p className="text-xs text-muted-foreground">Ocupación &gt;80% • Deuda &lt;$20k • Pagos al día</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator status="warning" size="md" />
          <div>
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Amarillo - Atención</p>
            <p className="text-xs text-muted-foreground">Ocupación 60-80% • Deuda $20k-$50k • Mora 7-30 días</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator status="danger" size="md" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Rojo - Crítico</p>
            <p className="text-xs text-muted-foreground">Ocupación &lt;60% • Deuda &gt;$50k • Mora &gt;30 días</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}