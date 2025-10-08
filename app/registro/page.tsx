"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, MapPin } from "lucide-react"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    sucursal_id: "",
  })
  const [sucursales, setSucursales] = useState<any[]>([])
  const [loadingSucursales, setLoadingSucursales] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const fetchSucursales = async () => {
      setLoadingSucursales(true)
      try {
        const response = await fetch("/api/sucursales")
        const data = await response.json()
        if (data.success) {
          setSucursales(data.data)
          console.log("[v0] Sucursales cargadas:", data.data.length)
        } else {
          setError("Error cargando sucursales")
        }
      } catch (err) {
        console.error("Error cargando sucursales:", err)
        setError("Error de conexión al cargar sucursales")
      } finally {
        setLoadingSucursales(false)
      }
    }

    fetchSucursales()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setStep(2)
  }

  const handleFinalSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("gym360_token", "authenticated")
        localStorage.setItem("gym360_user", JSON.stringify(data.user))
        router.push("/dashboard/cliente")
      } else {
        setError(data.error || "Error en el registro")
      }
    } catch (err) {
      console.error("Error en registro:", err)
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => (step === 1 ? router.push("/") : setStep(1))}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Registro de Cliente</CardTitle>
              <CardDescription>
                {step === 1 ? "Completa tus datos personales" : "Selecciona tu gimnasio"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Continuar
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {loadingSucursales ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Cargando sucursales...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Selecciona tu gimnasio</Label>
                    <Select onValueChange={(value) => handleInputChange("sucursal_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige una sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales.map((sucursal) => (
                          <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{sucursal.nombre}</span>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {sucursal.direccion}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {sucursales.length === 0 && !loadingSucursales && (
                      <p className="text-sm text-destructive">No hay sucursales disponibles</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">¿Qué incluye tu membresía?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Acceso completo al gimnasio</li>
                      <li>• Reserva de clases grupales</li>
                      <li>• Seguimiento de pagos</li>
                      <li>• Dashboard personal</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleFinalSubmit}
                    className="w-full"
                    disabled={!formData.sucursal_id || isLoading || sucursales.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      "Completar Registro"
                    )}
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
