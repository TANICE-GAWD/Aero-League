import { useState, useRef, useEffect } from "react"
import { Mail, Shield, ArrowLeft, CheckCircle } from "lucide-react"
import { useRequestOTPMutation, useVerifyOTPMutation } from "../../app/api/userApiSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../features/authSlice"
import { useDispatch } from "react-redux"
import { verifyUserEmail } from "../../features/authSlice"

const OTPVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const email = location.state?.email || user?.email
  const dispatch = useDispatch()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(null)
  const inputRefs = useRef([])

  const [requestOTP, { isLoading: isSending }] = useRequestOTPMutation()
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation()

  useEffect(() => {
    if (user?.email_verified === true || !(location.state?.from === "register" || location.state?.from === "dashboard")) {
      navigate("/404", { replace: true })
    }
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const sendOTP = async () => {
    try {
      await requestOTP({ email }).unwrap()
      setIsOtpSent(true)
      setCountdown(60)
      console.log("[OTP] Sent successfully to:", email)
    } catch (err) {
      console.error("[OTP] Error sending OTP:", err)
        setError(err?.data?.error || "Failed to send OTP. Please try again.")
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) return

    try {
      await verifyOTP({ email, otp: otpCode }).unwrap()
      setIsVerified(true)
      console.log("[OTP] Verified:", otpCode)

      if(!user) {
        setTimeout(() => navigate("/login", { replace: true }), 1500)
      }
      else{
        dispatch(verifyUserEmail())
        setTimeout(() => navigate("/user/dashboard", { replace: true }), 1500)
      }
    } catch (err) {
      console.error("[OTP] Verification failed:", err)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== "")) {
      setTimeout(() => handleVerify(), 300)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verified Successfully!</h1>
          <p className="text-gray-600 mb-6">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isOtpSent ? "Verify Your Email" : "Email Verification"}
          </h1>
          <p className="text-gray-600">
            {isOtpSent ? "Enter the 6-digit code sent to your email" : "We need to verify your email address"}
          </p>
        </div>

        {/* Email field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>

        {!isOtpSent ? (
          <button
            onClick={sendOTP}
            disabled={isSending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
          >
            {isSending ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <div>
            {/* OTP inputs */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Enter Verification Code</label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join("").length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 mb-4"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="text-red-500 p-2">{error}</p>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              {countdown > 0 ? (
                <p className="text-sm text-purple-600">Resend OTP in {countdown}s</p>
              ) : (
                <button
                  onClick={sendOTP}
                  disabled={isSending}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center w-full mt-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default OTPVerification
