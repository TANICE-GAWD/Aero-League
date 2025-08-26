import { useState, useRef, useEffect } from "react"
import { Mail, Shield, ArrowLeft, CheckCircle } from "lucide-react"
import { useRequestOTPMutation, useVerifyOTPMutation } from "../../app/api/userApiSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, verifyUserEmail } from "../../features/authSlice"
import styles from "./Otp.module.css"

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
    } catch (err) {
      setError(err?.data?.error || "Failed to send OTP. Please try again.")
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) return

    try {
      await verifyOTP({ email, otp: otpCode }).unwrap()
      setIsVerified(true)

      if (!user) {
        setTimeout(() => navigate("/login", { replace: true }), 1500)
      } else {
        dispatch(verifyUserEmail())
        setTimeout(() => navigate("/user/dashboard", { replace: true }), 1500)
      }
    } catch {
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    if (newOtp.every((digit) => digit !== "")) setTimeout(() => handleVerify(), 300)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  if (isVerified) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className={styles.title}>Verified Successfully!</h1>
          <p className={styles.subtitle}>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={styles.title}>
            {isOtpSent ? "Verify Your Email" : "Email Verification"}
          </h1>
          <p className={styles.subtitle}>
            {isOtpSent ? "Enter the 6-digit code sent to your email" : "We need to verify your email address"}
          </p>
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.label}>Email Address</label>
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="email" value={email} disabled className={styles.input} />
        </div>

        {!isOtpSent ? (
          <button onClick={sendOTP} disabled={isSending} className={styles.button}>
            {isSending ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <div className={styles.otpInputs}>
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
                  disabled={isVerifying}
                />
              ))}
            </div>

            <button onClick={handleVerify} disabled={isVerifying || otp.join("").length !== 6} className={styles.button}>
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.resend}>
              {countdown > 0 ? (
                <p>Resend OTP in {countdown}s</p>
              ) : (
                <button onClick={sendOTP} disabled={isSending} className={styles.resendButton}>
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        <button onClick={() => navigate("/login")} className={styles.backButton}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default OTPVerification
