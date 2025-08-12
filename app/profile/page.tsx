import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>
    </ProtectedRoute>
  )
}
