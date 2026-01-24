import axios from 'axios';

export const verifyRecaptcha = async (token) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.warn("RECAPTCHA_SECRET_KEY is not set. Skipping verification (dev mode).");
        return true;
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
        );

        const data = response.data;

        // v3 returns a score (0.0 to 1.0)
        // We can check if success is true and score is high enough
        if (data.success && data.score >= 0.5) {
            return true;
        }

        console.warn("reCAPTCHA validation failed:", data);
        return false;

    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return false;
    }
};
