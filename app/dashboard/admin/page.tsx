import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminSucursalDashboard } from "@/components/dashboard/admin-sucursal-dashboard"

export default function AdminSucursalPage() {
  return (
    <DashboardLayout userType="admin_sucursal">
      <AdminSucursalDashboard />
    </DashboardLayout>
  )
}
