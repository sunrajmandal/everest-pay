import crypto from 'crypto';

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_BASE_URL = process.env.ESEWA_BASE_URL || 'https://rc-epay.esewa.com.np';

export function generateEsewaSignature(message: string): string {
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
  hmac.update(message);
  return hmac.digest('base64');
}

export function getEsewaPaymentUrl(): string {
  return `${ESEWA_BASE_URL}/api/epay/main/v2/form`;
}

export interface EsewaFormFields {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export function buildEsewaFormFields(
  amount: number,
  transactionUuid: string,
  successUrl: string,
  failureUrl: string
): EsewaFormFields {
  const totalAmount = Number(amount).toString(); // Ensure it's a clean string without extra decimals if not needed
  const signedFieldNames = 'total_amount,transaction_uuid,product_code';
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_MERCHANT_CODE}`;
  
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
  hmac.update(message, 'utf-8');
  const signature = hmac.digest('base64');

  return {
    amount: totalAmount,
    tax_amount: '0',
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_MERCHANT_CODE,
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: signedFieldNames,
    signature,
  };
}

export interface EsewaVerificationResponse {
  product_code: string;
  transaction_uuid: string;
  total_amount: number;
  status: string;
  ref_id: string;
}

export function decodeEsewaResponse(encodedData: string): EsewaVerificationResponse | null {
  try {
    const decoded = Buffer.from(encodedData, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function verifyEsewaTransaction(
  productCode: string,
  totalAmount: number,
  transactionUuid: string
): Promise<EsewaVerificationResponse | null> {
  try {
    const url = `${ESEWA_BASE_URL}/api/epay/transaction/status/?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
