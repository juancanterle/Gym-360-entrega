import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle, Users, DollarSign, Calendar } from "lucide-react"

export default function DocumentacionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Documentación del Sistema GYM360</h1>
          <p className="text-muted-foreground">Guía completa de funcionalidades implementadas</p>
        </div>

        {/* Sección 1: Drill Down/Drill Up */}
        <Card>
          <CardHeader>
            <CardTitle>1. Funcionalidad de Drill Down y Drill Up (3 Niveles)</CardTitle>
            <CardDescription>Navegación jerárquica de datos desde lo general a lo específico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Badge>Nivel 1</Badge> Vista General - Todas las Sucursales
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Muestra un resumen de todas las sucursales con métricas clave: miembros activos, ocupación promedio,
                  ingresos mensuales, membresías vencidas y deuda total.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Ubicación:</strong> Dashboard General → Sección "Vista Dashboard General - KPIs por Sucursal"
                </p>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Nivel 2</Badge> Detalle de Sucursal - Clases
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Al hacer clic en una sucursal, se expande para mostrar todas las clases disponibles con: tipo de
                  clase, entrenador asignado, horario popular, capacidad promedio y porcentaje de ocupación.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Endpoint:</strong>{" "}
                  <code className="bg-muted px-1 rounded">/api/dashboard/sucursales/[id]/clases</code>
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Badge variant="outline">Nivel 3</Badge> Detalle Individual - Miembros con Morosidad
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Al hacer clic en una clase, se expande para mostrar los miembros con problemas de pago: nombre
                  completo, plan contratado, días de mora, teléfono de contacto y monto de deuda.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Endpoint:</strong>{" "}
                  <code className="bg-muted px-1 rounded">/api/dashboard/sucursales/[id]/miembros?filtro=morosos</code>
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-sm mb-2">Justificación de Utilidad:</h4>
              <p className="text-sm text-muted-foreground">
                Este sistema permite a los administradores navegar desde una vista macro (todas las sucursales) hasta el
                detalle micro (miembros individuales con problemas), facilitando la toma de decisiones y la
                identificación rápida de áreas que requieren atención. Es especialmente útil para detectar patrones de
                morosidad y ocupación baja en clases específicas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sección 2: Semaforización */}
        <Card>
          <CardHeader>
            <CardTitle>2. Indicadores Visuales - Semaforización (3 Estados)</CardTitle>
            <CardDescription>Sistema de colores para identificar rápidamente el estado de las métricas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-700 dark:text-green-400">Verde - Óptimo</h3>
                </div>
                <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                  <li>• Ocupación de clases &gt; 80%</li>
                  <li>• Deuda total &lt; $20,000</li>
                  <li>• Membresías vencidas &lt; 10</li>
                  <li>• Pagos al día (0 días mora)</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">Amarillo - Atención</h3>
                </div>
                <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>• Ocupación 60-80%</li>
                  <li>• Deuda $20k - $50k</li>
                  <li>• Membresías vencidas 10-20</li>
                  <li>• Mora de 7-30 días</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-700 dark:text-red-400">Rojo - Crítico</h3>
                </div>
                <ul className="text-sm space-y-1 text-red-700 dark:text-red-300">
                  <li>• Ocupación &lt; 60%</li>
                  <li>• Deuda &gt; $50,000</li>
                  <li>• Membresías vencidas &gt; 20</li>
                  <li>• Mora &gt; 30 días</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-sm mb-2">Dónde se Aplica la Semaforización:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>1. Estado de Sucursales:</strong> Cada sucursal tiene 3 indicadores (ocupación, morosidad,
                  membresías)
                </li>
                <li>
                  <strong>2. Ocupación de Clases:</strong> Cada clase muestra su nivel de ocupación con color
                </li>
                <li>
                  <strong>3. Estado de Miembros:</strong> Cada miembro tiene indicadores de morosidad y membresía
                </li>
                <li>
                  <strong>4. Drill-Down Cards:</strong> Todos los niveles incluyen semaforización para navegación visual
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Justificación de Utilidad:</h4>
              <p className="text-sm text-muted-foreground">
                La semaforización permite identificar instantáneamente áreas problemáticas sin necesidad de leer
                números. Un administrador puede escanear visualmente el dashboard y detectar inmediatamente qué
                sucursales, clases o miembros requieren atención urgente (rojo), cuáles necesitan seguimiento (amarillo)
                y cuáles están funcionando correctamente (verde).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sección 3: Autenticación */}
        <Card>
          <CardHeader>
            <CardTitle>3. Sistema de Autenticación</CardTitle>
            <CardDescription>Control de acceso con roles diferenciados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Características Implementadas:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Consulta a tabla de usuarios en MySQL</li>
                  <li>✓ Contraseñas encriptadas con Base64</li>
                  <li>✓ Redirección automática post-login</li>
                  <li>✓ Sesión persistente con localStorage</li>
                  <li>✓ 3 roles: super_admin, admin_sucursal, miembro</li>
                </ul>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Flujo de Autenticación:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Usuario ingresa email y contraseña</li>
                  <li>Sistema consulta tabla usuarios</li>
                  <li>Verifica contraseña encriptada</li>
                  <li>Genera token JWT</li>
                  <li>Redirige según rol del usuario</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 4: Entidades del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>4. Entidades Representadas en el Dashboard</CardTitle>
            <CardDescription>4 entidades principales del sistema de gestión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">1. Sucursales (con Drill-Down)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gestión de múltiples ubicaciones con métricas de rendimiento, ocupación y finanzas. Incluye sistema de
                  drill-down de 3 niveles.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">2. Miembros</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control de clientes activos, membresías, asistencias y estado de pagos. Incluye filtros por morosidad
                  y riesgo de baja.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">3. Clases</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Programación de clases grupales con control de ocupación, horarios, entrenadores y capacidad máxima.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">4. Pagos</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seguimiento de ingresos mensuales, pagos pendientes, vencidos y confirmados. Cálculo automático de
                  deuda y morosidad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 5: Coherencia */}
        <Card>
          <CardHeader>
            <CardTitle>5. Coherencia y Utilidad del Sistema</CardTitle>
            <CardDescription>Fundamentación de las decisiones de diseño</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Páginas Implementadas:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <strong>Dashboard Super Admin:</strong> Vista consolidada de todas las sucursales para el propietario
                </li>
                <li>
                  <strong>Dashboard Admin Sucursal:</strong> Métricas específicas de una sucursal para su administrador
                </li>
                <li>
                  <strong>Dashboard Cliente:</strong> Vista personal con membresía, pagos y clases disponibles
                </li>
                <li>
                  <strong>Dashboard General con Drill-Down:</strong> Navegación jerárquica de 3 niveles
                </li>
                <li>
                  <strong>Gestión de Administradores:</strong> Creación y asignación de admins por sucursal
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="font-medium text-sm mb-2">Fundamentación:</h4>
              <p className="text-sm text-muted-foreground">
                El sistema está diseñado para proporcionar información relevante según el rol del usuario. El
                propietario necesita una vista macro de todas las operaciones, los administradores de sucursal requieren
                métricas detalladas de su ubicación específica, y los clientes necesitan acceso a su información
                personal y servicios disponibles. La semaforización y el drill-down permiten identificar rápidamente
                problemas y tomar decisiones informadas sin necesidad de generar reportes manuales.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sección 6: Tecnologías */}
        <Card>
          <CardHeader>
            <CardTitle>6. Tecnologías Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Frontend:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Next.js 15.2.4 (App Router)</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS v4</li>
                  <li>• shadcn/ui Components</li>
                  <li>• Recharts (gráficos)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Next.js API Routes</li>
                  <li>• MySQL 8.0</li>
                  <li>• mysql2 (driver)</li>
                  <li>• Base64 (encriptación)</li>
                  <li>• JWT (autenticación)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
