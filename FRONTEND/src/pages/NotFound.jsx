import { useNavigate } from "react-router-dom"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1) 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        </div>

        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-purple-600 hover:text-purple-800 font-medium underline transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
