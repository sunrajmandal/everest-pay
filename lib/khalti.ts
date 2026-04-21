const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key_621b183e390c41038c6428c531d041e1';
const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || 'https://a.khalti.com';

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: string;
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export async function initiateKhaltiPayment(
  amount: number, // in NPR (will be converted to paisa)
  purchaseOrderId: string,
  purchaseOrderName: string,
  returnUrl: string,
  customerEmail?: string,
  customerPhone?: string
): Promise<KhaltiInitiateResponse | null> {
  try {
    const payload: Record<string, unknown> = {
      return_url: returnUrl,
      website_url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      amount: Math.round(amount * 100), // Convert NPR to paisa
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
    };

    if ((payload.amount as number) < 1000) {
      console.error('Khalti error: Amount must be at least NPR 10');
      return null;
    }

    if (customerEmail) {
      payload.customer_info = {
        email: customerEmail,
        ...(customerPhone ? { phone: customerPhone } : {}),
      };
    }

    const res = await fetch(`${KHALTI_BASE_URL}/api/v2/epayment/initiate/`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Khalti initiate error:', err);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Khalti initiate exception:', error);
    return null;
  }
}

export async function lookupKhaltiPayment(pidx: string): Promise<KhaltiLookupResponse | null> {
  try {
    const res = await fetch(`${KHALTI_BASE_URL}/api/v2/epayment/lookup/`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Khalti lookup error:', err);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Khalti lookup exception:', error);
    return null;
  }
}
