import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Axios } from '../utils/Axios'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Loader from '../components/Loader'

interface FormData {
  email: string
  password: string
}

const Signin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      setisLoading(true)
      const res = await Axios.post('/signin', {
        email: formData.email,
        password: formData.password,
      })

      if (res) {
        window.localStorage.setItem('jwtKey', res.data.jwtToken)
        alert(res.data.message)
        console.log(res)
        navigate('/dashboard', {
          state: {
            name: res.data.userDetails.username,
            email: res.data.userDetails.email,
          },
        })
      }
      setisLoading(false)
    } catch (err: any) {
      setisLoading(false)
      console.log(err.response?.data.message)
      alert(err.response?.data.message)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <div className="flex items-center h-screen content-evenly">
        <div className="w-3/5 h-full hidden md:block">
          <img
            src="/assets/signinPic.png"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="md:w-2/5 md:px-0 px-5 w-full flex items-center justify-center min-h-screen">
          <div
            className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg"
            style={{
              boxShadow:
                'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
            }}
          >
            <h1 className="text-3xl font-bold text-[#40244c]">
              Let us know<span className="text-red-500 ml-2">!</span>
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center border-b border-gray-500 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full py-1 leading-tight focus:outline-none"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="relative flex items-center border-b border-gray-500 py-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 leading-tight focus:outline-none"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              <button
                className="w-full bg-[#40244c] hover:bg-[#5e396b] text-white rounded-lg py-2.5 text-md font-semibold cursor-pointer flex items-center justify-center"
                type="submit"
              >
                {isLoading ? <Loader /> : ''}
                <span className="pl-2">Sign In</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full outline outline-[#40244c] text-[#40244c] rounded-lg py-2 text-md font-semibold cursor-pointer"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
