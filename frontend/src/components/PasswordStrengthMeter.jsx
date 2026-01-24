import React from "react"

const PasswordStrengthMeter = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0
        if (!pass) return 0

        // Length check
        if (pass.length >= 6) strength += 1
        if (pass.length >= 10) strength += 1

        // Character variety checks
        if (/[A-Z]/.test(pass)) strength += 1
        if (/[0-9]/.test(pass)) strength += 1
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1

        return strength
    }

    const strength = getStrength(password)

    const getColor = (strength) => {
        if (strength === 0) return "bg-gray-200"
        if (strength <= 2) return "bg-red-500"
        if (strength <= 4) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getLabel = (strength) => {
        if (strength === 0) return ""
        if (strength <= 2) return "Weak"
        if (strength <= 4) return "Medium"
        return "Strong"
    }

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Password strength</span>
                <span className="text-xs font-medium text-gray-700">{getLabel(strength)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${getColor(strength)}`}
                    style={{ width: `${Math.min((strength / 5) * 100, 100)}%` }}
                ></div>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li className={password?.length >= 6 ? "text-green-600" : ""}>At least 6 characters</li>
                <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>Contains uppercase letter</li>
                <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>Contains number</li>
                <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>Contains special character</li>
            </ul>
        </div>
    )
}

export default PasswordStrengthMeter
