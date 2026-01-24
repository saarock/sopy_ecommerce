import crypto from "crypto"

// Use a consistent secret key. In production, this MUST come from environment variables.
// For development fallback, we use a fixed 32-byte key.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012" // Must be 32 chars
const IV_LENGTH = 16

export const encrypt = (text) => {
    if (!text) return text

    // Ensure key is 32 bytes (256 bits)
    // If the provided key is not 32 bytes, we might want to hash it or pad it, 
    // but for now we assume the admin sets it correctly or we use the fallback.
    // We'll create a buffer from the string to handle potential encoding issues if needed,
    // but let's stick to simple direct usage for now.

    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export const decrypt = (text) => {
    if (!text) return text

    const textParts = text.split(":")
    if (textParts.length !== 2) return text // Not encrypted or invalid format

    const iv = Buffer.from(textParts[0], "hex")
    const encryptedText = Buffer.from(textParts[1], "hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}
