"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Users, UserCheck, UserX, Shield } from "lucide-react"
import type { User } from "@/lib/types"

export default function AdminUsers() {
  const [users, setUsers] = useState<Omit<User, "password">[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Omit<User, "password">[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock users data for now since we don't have a users API endpoint yet
    const mockUsers: Omit<User, "password">[] = [
      {
        _id: "1" as any,
        username: "admin",
        email: "admin@techstore.com",
        role: "admin",
        first_name: "Admin",
        last_name: "User",
        phone: "+1 (555) 123-4567",
        created_at: new Date("2024-01-01"),
        updated_at: new Date("2024-01-01"),
        last_login: new Date("2024-01-15"),
        is_active: true,
      },
      {
        _id: "2" as any,
        username: "user",
        email: "user@example.com",
        role: "user",
        first_name: "John",
        last_name: "Doe",
        phone: "+1 (555) 987-6543",
        created_at: new Date("2024-01-05"),
        updated_at: new Date("2024-01-10"),
        last_login: new Date("2024-01-14"),
        is_active: true,
      },
      {
        _id: "3" as any,
        username: "jane_smith",
        email: "jane@example.com",
        role: "user",
        first_name: "Jane",
        last_name: "Smith",
        created_at: new Date("2024-01-08"),
        updated_at: new Date("2024-01-12"),
        last_login: new Date("2024-01-13"),
        is_active: true,
      },
    ]

    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user._id?.toString() === userId ? { ...user, is_active: !user.is_active } : user)))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage customer accounts and permissions</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user._id?.toString()}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">
                          {user.first_name} {user.last_name}
                        </h3>
                        {user.role === "admin" && (
                          <Badge variant="secondary" className="flex items-center">
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600">@{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-sm text-gray-600">
                      <div>Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                      {user.last_login && <div>Last login: {new Date(user.last_login).toLocaleDateString()}</div>}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user._id?.toString() || "")}
                        className={
                          user.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                        }
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "No users have registered yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
