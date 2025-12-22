import CryptoJS from "crypto-js";

export function generateSignature(fields, secretKey) {
  // IMPORTANT: exact order of fields
  const fieldOrder = [
    "total_amount",
    "transaction_uuid",
    "product_code",
    "amount",
    "tax_amount",
    "product_service_charge",
    "product_delivery_charge",
    "success_url",
    "failure_url"
  ];

  // Concatenate values in the same order
  const message = fieldOrder.map(f => fields[f]).join(",");

  // HMAC SHA256
  const hmac = CryptoJS.HmacSHA256(message, secretKey);
  const signature = CryptoJS.enc.Base64.stringify(hmac);

  return {
    signed_field_names: fieldOrder.join(","),
    signature
  };
}
