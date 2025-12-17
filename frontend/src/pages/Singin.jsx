import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handleGoogleCallback } from '../slices/authSlice'

export default function Signin() {
  const { role } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/${role}`
  }

  // ✅ Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userData = params.get('user')

    if (token && userData) {
      const parsedUser = JSON.parse(decodeURIComponent(userData))

      dispatch(handleGoogleCallback({ user: parsedUser, token }))

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [dispatch])

  // ✅ Redirect after login
  useEffect(() => {
    if (!user) return

    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'company') navigate('/company/dashboard')
    else if (user.role === 'student') navigate('/student/dashboard')
  }, [user, navigate])

  return (
    <div className="h-screen flex">
      <div className="flex w-[30%] bg-cyan-700 flex-col items-center justify-center">
        <h1 className="text-white my-10 text-lg font-bold">
          Welcome to YCCE Placement Portal
        </h1>
        <img src="/YCC Logo.png" alt="logo" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl text-cyan-800 font-bold mb-6 capitalize">
          Sign-in as {role}
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="bg-white border border-black py-3 px-4 rounded hover:bg-cyan-100"
        >
          Sign in with Google as {role}
        </button>
      </div>
    </div>
  )
}
