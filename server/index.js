const express = require('express')
const cors = require('cors')
const Razorpay = require('razorpay')
const crypto = require('crypto')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.get('/', (req, res)=>{
    res.json({
        message: 'Server is running',
        razorpay_configured: !!(process.env.KEY_ID && process.env.KEY_SECRET),
        key_id_present: !!process.env.KEY_ID,
        key_secret_present: !!process.env.KEY_SECRET
    })
})

app.post('/order', async (req, res) => {
    try {
      if (!process.env.KEY_ID || !process.env.KEY_SECRET) {
        console.error('Missing Razorpay credentials in environment variables')
        return res.status(500).json({ error: 'Server configuration error: Missing payment credentials' });
      }

      const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
  
      if (!req.body.amount) {
        return res.status(400).json({ error: 'Amount is required' });
      }
  
      const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt,
      };
  
      const order = await razorpay.orders.create(options);
      if (!order) return res.status(500).json({ error: 'Error creating order' });
  
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.KEY_ID
      });
    } catch (err) {
      console.error('Order creation error:', err);
      if (err.message && err.message.includes('authentication')) {
        res.status(401).json({ error: 'Authentication failed: Invalid Razorpay credentials' });
      } else {
        res.status(500).json({ error: 'Server Error' });
      }
    }
});

app.post('/verify', async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing required payment parameters' });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        res.json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
});  

app.listen(process.env.PORT, ()=>{
    console.log(`Server started on ${process.env.PORT}`)
})