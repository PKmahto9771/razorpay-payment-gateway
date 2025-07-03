import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [errors, setErrors] = useState({})
  const currency = 'INR'
  const backend_URL = 'https://razorpay-payment-gateway-uac2.onrender.com'

  // Quick payment presets
  const paymentPresets = [100, 500, 1000, 5000, 10000]

  // Format amount with proper currency formatting
  const formatAmount = (value) => {
    if (!value) return ''
    const num = parseFloat(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num).replace('₹', '')
  }

  const setPresetAmount = (presetAmount) => {
    setAmount(presetAmount.toString())
    validateAmount(presetAmount.toString())
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: '', type: '' }), 6000) // Increased duration
  }

  const validateAmount = (value) => {
    const newErrors = {}
    
    if (!value || value.trim() === '') {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(value) || parseFloat(value) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (parseFloat(value) > 500000) {
      newErrors.amount = 'Transaction limit is INR 500,000 only'
    } else if (parseFloat(value) < 1) {
      newErrors.amount = 'Minimum amount is INR 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch(`${backend_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Verification error:', error)
      return { success: false, message: 'Payment verification failed' }
    }
  }

  async function paymentHandler(e){
    e.preventDefault();
    
    if (!validateAmount(amount)) {
      return;
    }

    setLoading(true);
    try{
      // First, test server connection
      console.log('Testing server connection...')
      const serverTest = await fetch(`${backend_URL}/`)
      const serverStatus = await serverTest.json()
      console.log('Server status:', serverStatus)
      
      if (!serverStatus.razorpay_configured) {
        throw new Error('Server configuration error: Razorpay credentials not properly configured on server')
      }

      const response = await fetch(`${backend_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100,
          currency,
          receipt: crypto.randomUUID()
        })
      })
  
      const order = await response.json()
      
      if (!response.ok) {
        throw new Error(order.error || 'Failed to create order')
      }

      console.log('Order response:', order)

      if (!order.key_id) {
        throw new Error('Authentication key missing from server response')
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please check your internet connection.')
      }

      var options = {
        "key": order.key_id,
        amount: parseFloat(amount) * 100,
        currency,
        "name": "Pran Snacks",
        "description": "Test Transaction",
        "image": "https://images.seeklogo.com/logo-png/25/1/pran-logo-png_seeklogo-258211.png",
        "order_id": order.id,
        "handler": async function (response){
          const verificationResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
          
          if (verificationResult.success) {
            showNotification('Payment successful!', 'success')
          } else {
            showNotification('Payment verification failed. Please contact support.', 'error')
          }
        },
        "prefill": {
            "name": "Pran Kishor",
            "email": "prankishor@gmail.com", 
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
      };
  
      const rzp1 = new Razorpay(options);
      
      rzp1.on('payment.failed', function (response){
        console.error('Payment failed:', response.error)
        showNotification(`Payment failed: ${response.error.description}`, 'error')
      });

      // Add error handler for initialization issues
      try {
        rzp1.open();
      } catch (razorpayError) {
        console.error('Razorpay initialization error:', razorpayError)
        throw new Error(`Razorpay initialization failed: ${razorpayError.message}`)
      }
    }
    catch(err){
      console.error('Payment error:', err)
      
      let errorMessage = 'Payment failed. Please try again.'
      
      if (err.message.includes('Server configuration error')) {
        errorMessage = 'Server configuration issue: Razorpay credentials not set up properly.'
      } else if (err.message.includes('Authentication key')) {
        errorMessage = 'Configuration error: Authentication key issue. Please contact support.'
      } else if (err.message.includes('Razorpay SDK')) {
        errorMessage = 'Network error: Unable to load payment system. Please check your connection.'
      } else if (err.message.includes('Razorpay initialization')) {
        errorMessage = 'Payment system initialization failed. Please try again.'
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot connect to payment server. Please check your connection.'
      }
      
      showNotification(errorMessage, 'error')
    }
    finally{
      setLoading(false)
    }
  }


  return (
    <>
      <div className='product'>
        <h2 className='title'>💳 Razorpay Payment Gateway</h2>
        
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            <span className="notification-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close" 
              onClick={() => setNotification({ message: '', type: '' })}
            >
              ×
            </button>
          </div>
        )}
        
        <div className='amount-section'>
          <label htmlFor="amount"><h4 className='amount-label'>💰 Enter Amount</h4></label>
          
          {/* Payment Presets */}
          <div className="payment-presets">
            <p className="presets-label">Quick Select:</p>
            <div className="preset-buttons">
              {paymentPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${amount === preset.toString() ? 'active' : ''}`}
                  onClick={() => setPresetAmount(preset)}
                >
                  ₹{formatAmount(preset)}
                </button>
              ))}
            </div>
          </div>

          <div className="amount-input-container">
            <span className="currency-symbol">₹</span>
            <input 
              type="number" 
              id="amount"
              placeholder='Enter amount' 
              name="amount" 
              value={amount} 
              onChange={(e) => {
                setAmount(e.target.value)
                if (errors.amount) {
                  validateAmount(e.target.value)
                }
              }}
              onBlur={(e) => validateAmount(e.target.value)}
              className={`amount-input ${errors.amount ? 'error' : ''}`}
            />
          </div>
          
          {amount && !errors.amount && (
            <div className="amount-display">
              Amount: <strong>₹{formatAmount(amount)}</strong>
            </div>
          )}
          
          {errors.amount && <div className='error-message'>⚠️ {errors.amount}</div>}
        </div>

        <button 
          className={`pay-button ${loading ? 'loading' : ''}`}
          onClick={paymentHandler} 
          disabled={loading || Object.keys(errors).length > 0 || !amount}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing Payment...
            </>
          ) : (
            <>
              🔒 Pay ₹{amount ? formatAmount(amount) : '0'} Securely
            </>
          )}
        </button>

        {loading && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="loading-text">Connecting to secure payment gateway...</p>
          </div>
        )}
      </div>
    </>
  )
}

export default App
