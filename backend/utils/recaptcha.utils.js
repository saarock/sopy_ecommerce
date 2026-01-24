import axios from 'axios';

export const verifyRecaptcha = async (token, expectedAction) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        if (process.env.NODE_ENV === 'development') {
            console.warn("reCAPTCHA skipped in development mode");
            return true;
        }
        throw new Error("RECAPTCHA_SECRET_KEY is missing in production");
    }

    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: secretKey,
                    response: token,
                },
            }
        );

        const data = response.data;

        if (
            data.success &&
            data.score >= 0.5 &&
            data.action === expectedAction
        ) {
            return true;
        }

        console.warn("reCAPTCHA validation failed:", data);
        return false;

    } catch (err) {
        console.error("reCAPTCHA verification error:", err);
        return false;
    }
};
