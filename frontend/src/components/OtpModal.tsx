import { ChangeEvent, useState } from 'react'
import Loader from './Loader'

const OtpModal: React.FC<{
  email: string
  isLoading: boolean
  onClose: () => void
  onVerify: (otp: string) => void
}> = ({ email, onClose, onVerify, isLoading }) => {
  const [otp, setOtp] = useState('')

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
  }

  const handleVerify = () => {
    onVerify(otp)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
        <p className="mb-4">An OTP has been sent to {email}</p>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          className="border p-2 w-full mb-4"
          placeholder="Enter OTP"
        />
        <div className="flex justify-between">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded flex justify-center items-center"
            onClick={handleVerify}
          >
            {isLoading ? <Loader /> : ''}
            <span className="pl-2">Verify</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtpModal
