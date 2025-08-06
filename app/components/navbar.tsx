'use client'

import { useState, useEffect } from 'react'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import auth from '@/lib/firebase_auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Icon from "@/assets/icon.png";
import { KeyRound, Loader } from 'lucide-react'

export default function Navbar() {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })

        return () => unsubscribe()
    }, [])

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            await axios.post('/api/user', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            })

        } catch (error) {
            console.error("Error during login:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <nav className="bg-[#f4c692] border-b-6 border-[#f3b46b]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <Link className="flex items-center gap-3" href={"/"}>
                        <img src={Icon.src} alt='Icon' className='w-8' />
                        <span className="text-xl font-semibold">BorkJud</span>
                    </Link>
                    <div className="flex items-center">
                        {user ?
                            <Link href={`/user`}>
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                />
                            </Link>
                            : (
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="bg-[#703c00] text-white px-4 flex items-center gap-3 py-2 rounded-md"
                                >
                                    {loading ? <Loader className='animate-spin' /> : <KeyRound />}
                                    Login
                                </button>
                            )}
                    </div>
                </div>
            </div>
        </nav>
    )
}