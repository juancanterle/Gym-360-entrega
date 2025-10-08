import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ClienteDashboard } from "@/components/dashboard/cliente-dashboard"

export default function ClientePage() {
  return (
    <DashboardLayout userType="cliente">
      <ClienteDashboard />
    </DashboardLayout>
  )
}
