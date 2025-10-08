import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: "url('/gym-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">GYM360</h1>
          <p className="text-muted-foreground">Dashboard de Gestión Integral</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 GYM360 Dashboard. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
