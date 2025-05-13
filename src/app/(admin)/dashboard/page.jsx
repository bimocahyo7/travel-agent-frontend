import Header from '@/app/(admin)/Header'
import RoleGuard from '@/components/auth/RoleGuard'

export const metadata = {
    title: 'Laravel - Dashboard',
}

const Dashboard = () => {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="ml-64 p-6 space-y-6"> {/* space-y-6 untuk jarak antar elemen vertikal */}
                <Header title="Dashboard Admin" />
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 text-gray-800 text-lg font-medium">
                            You are logged in Admin!
                        </div>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}

export default Dashboard
