import { useState, useRef, useEffect } from "react"
import { Mail, Shield, ArrowLeft, Lock, CheckCircle } from "lucide-react"
import {
  useRequestOTPMutation,
  useValidateOTPMutation,
  useResetPasswordMutation,
} from "../../app/api/userApiSlice"
import { useNavigate } from "react-router-dom"
import styles from "./ForgotPassword.module.css"

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

  const sendOTP = async () => {
    setError(null)
    if (!email) return setError("Please enter your email")
    try {
      await requestOTP({ email }).unwrap()
      setStep(2)
      setCountdown(60)
    } catch (err) {
      setError(err?.data?.error || "Failed to send OTP. Please try again.")
    }
  }

  const handleValidateOTP = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) return
    try {
      await validateOTP({ email, otp: otpCode }).unwrap()
      setStep(3)
    } catch (err) {
      setError(err?.data?.error || "Invalid OTP")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResetPassword = async () => {
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password !== confirmPassword) return setError("Passwords do not match")

    try {
      await resetPassword({ email, password }).unwrap()
      setSuccess(true)
      setTimeout(() => navigate("/login", { replace: true }), 2000)
    } catch (err) {
      setError(err?.data?.error || "Failed to reset password. Try again.")
    }
  }

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

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className={styles.successTitle}>Password Reset!</h1>
          <p className={styles.successMessage}>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={styles.title}>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h1>
          <p className={styles.subtitle}>
            {step === 1 && "Enter your registered email to receive OTP"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
            <button onClick={sendOTP} disabled={isSending} className={styles.button}>
              {isSending ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <label className={styles.label}>Enter Verification Code</label>
            <div className={styles.otpContainer}>
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
                  className={styles.otpInput}
                  disabled={isValidating}
                />
              ))}
            </div>
            <button
              onClick={handleValidateOTP}
              disabled={otp.join("").length !== 6 || isValidating}
              className={styles.button}
            >
              {isValidating ? "Validating..." : "Verify OTP"}
            </button>
            {countdown > 0 ? (
              <p className={styles.resend}>Resend OTP in {countdown}s</p>
            ) : (
              <button onClick={sendOTP} className={styles.resend}>
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <label className={styles.label}>New Password</label>
            <div className={styles.inputWrapper}>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button onClick={handleResetPassword} disabled={isResetting} className={styles.button}>
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button onClick={() => navigate("/login")} className={styles.backButton}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
