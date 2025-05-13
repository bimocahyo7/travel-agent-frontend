'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(admin)/Header'
import { useAuth } from '@/hooks/auth'

const User = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
    })

    const { getUsers, createUser, updateUser, deleteUser } = useAuth()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData)
            } else {
                await createUser(formData)
            }
            await fetchUsers()
            setModalOpen(false)
            setEditingUser(null)
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                role: '',
            })
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleEdit = user => {
        setEditingUser(user)
        setFormData(user)
        setModalOpen(true)
    }

    const handleDelete = async id => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            try {
                await deleteUser(id)
                await fetchUsers()
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
    }

    return (
        <>
            <div className="ml-64 p-6 space-y-6">
                <Header title="User" />
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-bold mb-4">Users</h1>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                                Tambah User
                            </button>

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border px-4 py-2">
                                                ID
                                            </th>
                                            <th className="border px-4 py-2">
                                                Name
                                            </th>
                                            <th className="border px-4 py-2">
                                                Email
                                            </th>
                                            <th className="border px-4 py-2">
                                                Phone
                                            </th>
                                            <th className="border px-4 py-2">
                                                Address
                                            </th>
                                            <th className="border px-4 py-2">
                                                Role
                                            </th>
                                            <th className="border px-4 py-2">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td className="border px-4 py-2">
                                                    {user.id}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {user.name}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {user.email}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {user.phone}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {user.address}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {user.role}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(user)
                                                        }
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-red-500 text-white rounded">
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editingUser ? 'Edit User' : 'Tambah User'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="block w-full border p-2 mb-2"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full border p-2 mb-2"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="block w-full border p-2 mb-2"
                                hidden
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="block w-full border p-2 mb-2"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="block w-full border p-2 mb-2"
                            />
                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="block w-full border p-2 mb-2"
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded">
                                Simpan
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">
                                Batal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default User
