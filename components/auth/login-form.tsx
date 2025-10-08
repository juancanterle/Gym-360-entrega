"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store auth data
        localStorage.setItem("gym360_token", "authenticated")
        localStorage.setItem("gym360_user", JSON.stringify(data.user))

        // Redirect using the URL provided by the API
        router.push(data.redirectUrl)
      } else {
        setError(data.error || "Error de autenticación")
      }
    } catch (err) {
      console.error("Error en login:", err)
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTestUser = (userType: "dueno" | "admin" | "cliente") => {
    const testUsers = {
      dueno: { email: "dueno@gym360.com", password: "superadmin123" },
      admin: { email: "admin.centro@gym360.com", password: "admin123" },
      cliente: { email: "pedro.gonzalez@email.com", password: "cliente123" },
    }

    const user = testUsers[userType]
    setEmail(user.email)
    setPassword(user.password)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Iniciar Sesión</h3>
        <p className="text-muted-foreground">Accede a tu cuenta GYM360</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-center mb-3">Usuarios de Prueba - Clic para cargar:</p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadTestUser("dueno")}
              className="text-left justify-start bg-green-50 hover:bg-green-100 border-green-200"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-green-700">🏢 Dueño del Sistema</span>
                <span className="text-xs text-green-600">dueno@gym360.com - Gestión completa</span>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadTestUser("admin")}
              className="text-left justify-start bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-blue-700">👨‍💼 Admin Sucursal</span>
                <span className="text-xs text-blue-600">admin.centro@gym360.com - Gestión sucursal</span>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadTestUser("cliente")}
              className="text-left justify-start bg-purple-50 hover:bg-purple-100 border-purple-200"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-purple-700">🏃‍♂️ Cliente</span>
                <span className="text-xs text-purple-600">pedro.gonzalez@email.com - Vista cliente</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">¿Eres nuevo cliente?</p>
          <Button type="button" variant="link" onClick={() => router.push("/registro")} className="text-sm">
            Registrarse como cliente
          </Button>
        </div>
      </form>
    </div>
  )
}
