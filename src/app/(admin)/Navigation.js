import Link from 'next/link'
import { usePathname } from 'next/navigation' // Import usePathname
import { Home, User, Settings, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth'

const Navigation = ({ user }) => {
    const { logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname() // Ambil path halaman saat ini

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'User', href: '/user', icon: User },
        { name: 'Destination', href: '/destination', icon: X },
        { name: 'Settings', href: '/settings', icon: Settings },
    ]

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white min-h-screen transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {isSidebarOpen && (
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                                <span className="text-gray-800 font-bold">
                                    T
                                </span>
                            </div>
                            <span className="ml-3 text-xl font-semibold">
                                Travel Agent
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="focus:outline-none">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* User Info */}
                <div
                    className={`p-4 flex items-center ${isSidebarOpen ? 'flex-row' : 'flex-col'}`}>
                    <div className="bg-gray-700 rounded-full p-2">
                        <User size={24} />
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-3">
                            <div className="text-sm font-medium">
                                {user?.name || 'User'}
                            </div>
                            <div className="text-xs text-gray-400">
                                {user?.email || 'user@example.com'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="mt-5">
                    {menuItems.map(item => (
                        <Link href={item.href} key={item.href} legacyBehavior>
                            <a
                                className={`flex items-center py-3 px-4 hover:bg-gray-700 transition duration-200
                                ${pathname === item.href ? 'bg-gray-900' : ''}`}>
                                <item.icon size={20} />
                                {isSidebarOpen && (
                                    <span className="ml-3 text-sm">
                                        {item.name}
                                    </span>
                                )}
                            </a>
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 w-full">
                    <button
                        onClick={logout}
                        className={`
              flex items-center 
              ${isSidebarOpen ? 'px-4' : 'justify-center'}
              py-3 
              w-full 
              hover:bg-red-600 
              bg-gray-900
              transition duration-200
            `}>
                        <LogOut size={20} />
                        {isSidebarOpen && (
                            <span className="ml-3 text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navigation
