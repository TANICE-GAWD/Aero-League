import { useState, useRef, useEffect } from "react"
import { Mail, Shield, ArrowLeft, Lock, CheckCircle } from "lucide-react"
import { useRequestOTPMutation, useValidateOTPMutation, useResetPasswordMutation } from "../../app/api/userApiSlice"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const inputRefs = useRef([])

  const [requestOTP, { isLoading: isSending }] = useRequestOTPMutation()
  const [validateOTP, { isLoading: isValidating }] = useValidateOTPMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Send OTP
  const sendOTP = async () => {
    setError(null)
    if (!email) return setError("Please enter your email")
    try {
      await requestOTP({ email }).unwrap()
      setStep(2)
      setCountdown(60)
      console.log("[ForgotPassword] OTP sent to:", email)
    } catch (err) {
      console.error("[ForgotPassword] Error sending OTP:", err)
      setError(err?.data?.error || "Failed to send OTP. Please try again.")
    }
  }

  const handleValidateOTP = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) return
    try {
      await validateOTP({ email, otp: otpCode }).unwrap()
      setStep(3)
      console.log("[ForgotPassword] OTP validated:", otpCode)
    } catch (err) {
      console.error("[ForgotPassword] OTP validation failed:", err)
      setError(err?.data?.error || "Invalid OTP")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  // Reset Password
  const handleResetPassword = async () => {
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password !== confirmPassword) return setError("Passwords do not match")

    try {
      await resetPassword({ email, password }).unwrap()
      setSuccess(true)
      console.log("[ForgotPassword] Password reset successfully")
      setTimeout(() => navigate("/login", { replace: true }), 2000)
    } catch (err) {
      console.error("[ForgotPassword] Reset failed:", err)
      setError(err?.data?.error || "Failed to reset password. Try again.")
    }
  }

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    if (newOtp.every((digit) => digit !== "")) setTimeout(() => handleValidateOTP(), 300)
  }
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // ✅ Final Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
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
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h1>
          <p className="text-gray-600">
            {step === 1 && "Enter your registered email to receive OTP"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative mb-6">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700"
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={isSending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isSending ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div>
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
                    disabled={isValidating}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleValidateOTP}
              disabled={otp.join("").length !== 6 || isValidating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 mb-4"
            >
              {isValidating ? "Validating..." : "Verify OTP"}
            </button>
            {countdown > 0 ? (
              <p className="text-sm text-purple-600 text-center">Resend OTP in {countdown}s</p>
            ) : (
              <button
                onClick={sendOTP}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium block mx-auto"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative mb-6">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isResetting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {/* Back to Login */}
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

export default ForgotPassword
