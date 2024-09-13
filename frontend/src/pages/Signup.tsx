import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Axios } from '../utils/Axios.ts'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import OtpModal from '../components/OtpModal.tsx'
import Loader from '../components/Loader.tsx'

interface FormData {
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
  contactMode: string
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordForConfirm, setshowPasswordForConfirm] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [isLoadingforVerify, setisLoadingforVerify] = useState(false)

  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactMode: '',
  })

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()

    if (formData.password === formData.confirmPassword) {
      try {
        setisLoading(true)
        const res = await Axios.post('/request-otp', {
          email: formData.email,
        })
        if (res) {
          setOtpEmail(formData.email)
          setShowModal(true)
        }
        setisLoading(false)
      } catch (err: any) {
        setisLoading(false)
        console.log(err.response?.data.message)
        alert(err.response?.data.message)
      }
    } else {
      alert('Passwords do not match')
      console.log('Passwords do not match')
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleOtpVerification = async (otp: string) => {
    try {
      setisLoadingforVerify(true)
      const verifyRes = await Axios.post('/verify-otp', {
        email: otpEmail,
        otp: otp,
      })
      if (verifyRes) {
        const signupRes = await Axios.post('/signup', {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          contactMode: formData.contactMode,
        })

        if (signupRes) {
          window.localStorage.setItem('jwtKey', signupRes.data.jwtToken)
          alert('OTP verified successfully. Redirecting to dashboard.')
          setShowModal(false)
          navigate('/dashboard', {
            state: {
              name: signupRes.data.userDetails.username,
              email: signupRes.data.userDetails.email,
            },
          })
        }

        setisLoadingforVerify(false)
      }
    } catch (err: unknown) {
      setisLoadingforVerify(false)
      alert('Invalid OTP or expired OTP. Please try again.')
    }
  }

  return (
    <div>
      {/* OTP Modal */}
      {showModal && (
        <OtpModal
          email={otpEmail}
          onClose={() => setShowModal(false)}
          onVerify={handleOtpVerification}
          isLoading={isLoadingforVerify}
        />
      )}

      <div className="flex items-center h-screen content-evenly">
        <div className="w-3/5 h-full hidden md:block">
          <img
            src="/assets/signupPic.png"
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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#40244c]">
                Let us know<span className="text-red-500 ml-2">!</span>
              </h1>

              <div>
                <Link
                  className="text-[#40244c] text-lg font-bold underline"
                  to="/"
                >
                  Sign <span className="text-red-500 ">In</span>
                </Link>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="flex items-center border-b border-gray-500 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full py-1 leading-tight focus:outline-none"
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center border-b border-gray-500 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full py-1 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative flex items-center border-b border-gray-500 py-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 leading-tight focus:outline-none"
                  name="password"
                  placeholder="Set Password"
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

              <div className="relative flex items-center border-b border-gray-500 py-2">
                <input
                  className="appearance-none bg-transparent border-none w-full py-1 leading-tight focus:outline-none"
                  type={showPasswordForConfirm ? 'text' : 'password'}
                  placeholder="Retype Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() =>
                    setshowPasswordForConfirm(!showPasswordForConfirm)
                  }
                >
                  {showPasswordForConfirm ? (
                    <EyeOffIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              <div className="flex items-center border-b border-gray-500 py-2">
                <select
                  name="contactMode"
                  className=" bg-transparent border-none w-full py-1 leading-tight focus:outline-none text-gray-500"
                  value={formData.contactMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" selected disabled>
                    Contact Mode
                  </option>
                  <option value="email">Email</option>
                </select>
              </div>

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
              <button
                className="w-full bg-[#40244c] hover:bg-[#5e396b] text-white rounded-lg py-2.5 text-md font-semibold cursor-pointer flex items-center justify-center"
                type="submit"
              >
                {isLoading ? <Loader /> : ''}
                <span className="pl-2">Sign Up</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
