import Header from '@/app/(admin)/Header'
import RoleGuard from '@/components/RoleGuard'

export const metadata = {
    title: 'Laravel - Dashboard',
}

const Dashboard = () => {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <Header title="Dashboard Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            You are logged in Admin!
                        </div>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}

export default Dashboard