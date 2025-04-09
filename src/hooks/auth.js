import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    const getUsers = async () => {
        const response = await axios.get('/api/users')
        return response.data
    }

    const createUser = async user => {
        await axios.post('/api/users', user)
    }

    const updateUser = async (id, user) => {
        await axios.put(`/api/users/${id}`, user)
    }

    const deleteUser = async id => {
        await axios.delete(`/api/users/${id}`)
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            // Cek apakah redirectIfAuthenticated adalah fungsi atau string
            const redirectPath = typeof redirectIfAuthenticated === 'function' 
                ? redirectIfAuthenticated(user) 
                : redirectIfAuthenticated
                
            router.push(redirectPath)
        }
    
        if (middleware === 'auth' && (user && !user.email_verified_at))
            router.push('/verify-email')
        
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        ) {
            // Cek apakah redirectIfAuthenticated adalah fungsi atau string
            const redirectPath = typeof redirectIfAuthenticated === 'function' 
                ? redirectIfAuthenticated(user) 
                : redirectIfAuthenticated
                
            router.push(redirectPath)
        }
        
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
    }
}