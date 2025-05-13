'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const [status, setStatus] = useState(null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded shadow">
                <div className="mb-4 text-sm text-gray-600 text-left">
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just emailed to
                    you? If you didn't receive the email, we will gladly send you
                    another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-600 text-left">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                    <button
                        type="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900"
                        onClick={logout}>
                        Logout
                    </button>

                    <Button onClick={() => resendEmailVerification({ setStatus })}>
                        Resend Verification Email
                    </Button>
                </div>
            </div>
        </div>
    )

}

export default Page
