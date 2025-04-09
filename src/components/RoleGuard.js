'use client'
// components/RoleGuard.js
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RoleGuard({ children, allowedRoles }) {
    const { user, isLoading } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && user) {
            if (!allowedRoles.includes(user.role)) {
                // Redirect ke halaman default berdasarkan role user
                const redirectPath = user.role === 'admin' ? '/dashboard' : '/dashboard2'
                router.push(redirectPath)
            }
        }
    }, [user, isLoading, allowedRoles, router])

    // Tampilkan loading state atau null jika masih loading atau user tidak memiliki role yang diizinkan
    if (isLoading || !user || !allowedRoles.includes(user.role)) {
        return null // Atau komponen loading
    }

    // Render children jika user memiliki role yang diizinkan
    return <>{children}</>
}