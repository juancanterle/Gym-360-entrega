import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SuperAdminDashboard } from "@/components/dashboard/super-admin-dashboard"

export default function SuperAdminPage() {
  return (
    <DashboardLayout userType="super_admin">
      <SuperAdminDashboard />
    </DashboardLayout>
  )
}
