import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState()
  const currency = 'INR'
  const backend_URL = 'https://razorpay-payment-gateway-uac2.onrender.com'

  async function paymentHandler(e){
    setLoading(true);
    try{
      if(amount <= 0){
        alert('Please enter a valid amount');
        return;
      }

      if(amount >500000){
        alert('Transaction Limit is INR 500000 only')
        return;
      }
      const response = await fetch(`${backend_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount:amount*100,
          currency,
          receipt: crypto.randomUUID()
        })
      })
  
      const order = await response.json()
      console.log('order:', order)
  
      var options = {
        "key": import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount, // Amount is in currency subunits. Hence, 50000 refers to 50000 paise
        currency,
        "name": "Pran Snacks", // business name
        "description": "Test Transaction",
        "image": "https://images.seeklogo.com/logo-png/25/1/pran-logo-png_seeklogo-258211.png",
        "order_id": order.id,
        "handler": function (response){
          alert('Payment Successful');
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com", 
            "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
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
              alert(response.error.code);
              alert(response.error.description);
              alert(response.error.source);
              alert(response.error.step);
              alert(response.error.reason);
              alert(response.error.metadata.order_id);
              alert(response.error.metadata.payment_id);
      });
  
      rzp1.open();
      e.preventDefault();
    }
    catch(err){
      alert('Payment Failed. Please try again.', err);
    }
    finally{
      setLoading(false)
    }
  }


  return (
    <>
      <div className='product'>
        <h2 className='title'>Razorpay Payment Gateway</h2>
        <div className='amount'>
          <label htmlFor=""><h4 className='amount-label'>Enter Amount (INR)</h4></label>
          <input type="number" placeholder='5.75' name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ textAlign: "center", padding: 10, margin: 10 }}/>
        </div>
        <button className='button' onClick={paymentHandler} disabled={loading}>{loading? 'Processing...' : 'Pay Now'}</button>
      </div>
    </>
  )
}

export default App
