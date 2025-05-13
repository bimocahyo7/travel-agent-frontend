'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(customer)/Navigation'
import Loading from '@/app/(customer)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Navigation user={user} />
            <main className="flex-1 p-4">{children}</main>{' '}
            {/* Perbaiki dengan flex-1 */}
        </div>
    )
}

export default AppLayout
