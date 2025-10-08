"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Admin {
  id: number
  nombre: string
  apellido: string
  email: string
  sucursal_id: number
  sucursal_nombre: string
  activo: boolean
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      nombre: "Carlos",
      apellido: "Administrador",
      email: "admin.centro@gym360.com",
      sucursal_id: 1,
      sucursal_nombre: "Sucursal Centro",
      activo: true,
    },
    {
      id: 2,
      nombre: "María",
      apellido: "Gestora",
      email: "admin.norte@gym360.com",
      sucursal_id: 2,
      sucursal_nombre: "Sucursal Norte",
      activo: true,
    },
    {
      id: 3,
      nombre: "Roberto",
      apellido: "Manager",
      email: "admin.sur@gym360.com",
      sucursal_id: 3,
      sucursal_nombre: "Sucursal Sur",
      activo: false,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    sucursal_id: "",
  })
  const [message, setMessage] = useState("")

  const sucursales = [
    { id: 1, nombre: "Sucursal Centro" },
    { id: 2, nombre: "Sucursal Norte" },
    { id: 3, nombre: "Sucursal Sur" },
    { id: 4, nombre: "Sucursal Este" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAdmin) {
      // Editar administrador existente
      setAdmins(
        admins.map((admin) =>
          admin.id === editingAdmin.id
            ? {
                ...admin,
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                sucursal_id: Number.parseInt(formData.sucursal_id),
                sucursal_nombre: sucursales.find((s) => s.id === Number.parseInt(formData.sucursal_id))?.nombre || "",
              }
            : admin,
        ),
      )
      setMessage("Administrador actualizado correctamente")
    } else {
      // Crear nuevo administrador
      const newAdmin: Admin = {
        id: Math.max(...admins.map((a) => a.id)) + 1,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        sucursal_id: Number.parseInt(formData.sucursal_id),
        sucursal_nombre: sucursales.find((s) => s.id === Number.parseInt(formData.sucursal_id))?.nombre || "",
        activo: true,
      }
      setAdmins([...admins, newAdmin])
      setMessage("Administrador creado correctamente")
    }

    // Reset form
    setFormData({ nombre: "", apellido: "", email: "", password: "", sucursal_id: "" })
    setEditingAdmin(null)
    setIsDialogOpen(false)

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000)
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setFormData({
      nombre: admin.nombre,
      apellido: admin.apellido,
      email: admin.email,
      password: "",
      sucursal_id: admin.sucursal_id.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (adminId: number) => {
    setAdmins(admins.filter((admin) => admin.id !== adminId))
    setMessage("Administrador eliminado correctamente")
    setTimeout(() => setMessage(""), 3000)
  }

  const toggleStatus = (adminId: number) => {
    setAdmins(admins.map((admin) => (admin.id === adminId ? { ...admin, activo: !admin.activo } : admin)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Administradores</h2>
          <p className="text-muted-foreground">Administra los usuarios con acceso administrativo a las sucursales</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAdmin(null)
                setFormData({ nombre: "", apellido: "", email: "", password: "", sucursal_id: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAdmin ? "Editar Administrador" : "Nuevo Administrador"}</DialogTitle>
              <DialogDescription>
                {editingAdmin
                  ? "Modifica los datos del administrador seleccionado"
                  : "Crea un nuevo administrador para gestionar una sucursal"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{editingAdmin ? "Nueva Contraseña (opcional)" : "Contraseña"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingAdmin}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sucursal">Sucursal</Label>
                <Select
                  value={formData.sucursal_id}
                  onValueChange={(value) => setFormData({ ...formData, sucursal_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
                        {sucursal.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingAdmin ? "Actualizar Administrador" : "Crear Administrador"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {admin.nombre} {admin.apellido}
                    </h3>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                    <p className="text-sm text-muted-foreground">{admin.sucursal_nombre}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={admin.activo ? "default" : "secondary"}>{admin.activo ? "Activo" : "Inactivo"}</Badge>

                  <Button variant="outline" size="sm" onClick={() => toggleStatus(admin.id)}>
                    {admin.activo ? "Desactivar" : "Activar"}
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleEdit(admin)}>
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleDelete(admin.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
