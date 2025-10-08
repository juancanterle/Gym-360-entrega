import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "GYM360 Dashboard - Gestión Integral de Gimnasios",
  description:
    "Dashboard web para gestión integral de cadena de gimnasios. Centraliza ventas de membresías, asistencia, ocupación de clases, morosidad y desempeño.",
  keywords: "gimnasio, dashboard, gestión, membresías, fitness, analytics",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  )
}
