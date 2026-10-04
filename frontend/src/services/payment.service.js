import axios from 'axios'

const getApiHost = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost'
  return `http://${hostname}:5000`
}

const API_URL = getApiHost()

export const getPlans = async () => (await axios.get(`${API_URL}/api/payment/plans`)).data.plans

export const createOrder = async (plan, token) => (await axios.post(
  `${API_URL}/api/payment/create-order`, { plan }, { headers: { Authorization: `Bearer ${token}` } },
)).data

export const verifyPayment = async (payload, token) => (await axios.post(
  `${API_URL}/api/payment/verify`, payload, { headers: { Authorization: `Bearer ${token}` } },
)).data

export const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true)
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

export const openRazorpayCheckout = async ({ plan, token, user, onSuccess, onError, onCancelled }) => {
  try {
    if (!token) throw new Error('Please sign in before upgrading.')
    if (!(await loadRazorpayScript())) throw new Error('Razorpay Checkout could not load. Check your connection and try again.')
    const data = await createOrder(plan, token)
    const options = {
      key: data.keyId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      name: 'DocAi (ScholarAI)',
      description: `${data.planName} plan · 30 days`,
      prefill: { name: user?.name || '', email: user?.email || '' },
      theme: { color: '#4F46E5' },
      handler: async (response) => {
        try {
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }, token)
          if (result.success) onSuccess?.(result)
          else onError?.(result.message || 'Payment verification failed.')
        } catch (error) {
          onError?.(error.response?.data?.message || 'Payment verification could not finish. If charged, contact support with the order ID.')
        }
      },
      modal: { ondismiss: () => onCancelled?.() },
    }
    const checkout = new window.Razorpay(options)
    checkout.on('payment.failed', (event) => onError?.(event.error?.description || 'Payment failed. Please try again.'))
    checkout.open()
  } catch (error) {
    onError?.(error.response?.data?.message || error.message || 'Could not start checkout.')
  }
}
