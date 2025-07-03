# 💳 Razorpay Payment Gateway Integration

A modern, secure, and user-friendly payment gateway application built with React.js and Node.js, featuring Razorpay integration for seamless online payments.

## 🌟 Features

### 💰 **Payment Features**
- ✅ Secure Razorpay payment integration
- ✅ Real-time payment verification
- ✅ Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- ✅ Transaction limit validation (₹1 - ₹5,00,000)
- ✅ Payment receipt generation

### 🎨 **User Experience**
- ✅ Modern glassmorphism design
- ✅ Quick payment presets (₹100, ₹500, ₹1K, ₹5K, ₹10K)
- ✅ Real-time currency formatting
- ✅ Interactive loading states with progress indicators
- ✅ Toast notifications with icons
- ✅ Fully responsive mobile-first design

### 🔒 **Security Features**
- ✅ Server-side payment verification
- ✅ HMAC SHA256 signature validation
- ✅ Environment-based configuration
- ✅ Secure API key handling
- ✅ Input validation and sanitization

### 🎯 **Technical Features**
- ✅ React.js with modern hooks
- ✅ Express.js REST API
- ✅ Error boundaries and graceful error handling
- ✅ Form validation with real-time feedback
- ✅ Cross-platform compatibility

## 🚀 Live Demo

🌐 **[View Live Demo](https://razorpay-payment-gateway-eight.vercel.app/)**

## 📸 Screenshots

### Desktop View
![Desktop Payment Interface](https://via.placeholder.com/800x500/667eea/ffffff?text=Desktop+Payment+Interface)

### Mobile View
![Mobile Payment Interface](https://via.placeholder.com/400x600/667eea/ffffff?text=Mobile+Payment+Interface)

## 🛠️ Tech Stack

### Frontend
- **React.js 19+** - Modern UI library
- **CSS3** - Custom styling with glassmorphism effects
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Razorpay SDK** - Payment gateway integration
- **CORS** - Cross-origin resource sharing

### Payment Integration
- **Razorpay** - Payment gateway
- **Crypto** - Signature verification
- **HMAC SHA256** - Security validation

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- Razorpay account with API keys
- Git installed

### Clone Repository
```bash
git clone https://github.com/yourusername/razorpay-payment-gateway.git
cd razorpay-payment-gateway
```

### Backend Setup
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
PORT=5000
EOF

# Start server
npm start
```

### Frontend Setup
```bash
cd client
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
KEY_ID=rzp_test_your_key_id
KEY_SECRET=your_key_secret
PORT=5000
```

#### Client
No client-side environment variables needed for security.

### Razorpay Setup
1. Create account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Generate API keys from Settings > API Keys
3. Add keys to server `.env` file
4. Enable required payment methods

## 🏗️ Project Structure

```
razorpay-payment-gateway/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # Entry point
│   ├── public/
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
└── README.md
```

## 🔐 Security Features

### Payment Verification
- Server-side signature verification using HMAC SHA256
- Razorpay webhook validation
- Secure API key management

### Input Validation
- Amount range validation (₹1 - ₹5,00,000)
- Real-time form validation
- Error handling for edge cases

### Environment Security
- API keys stored server-side only
- CORS configuration
- Environment-based configuration

## 🎯 API Endpoints

### POST `/order`
Creates a new payment order
```json
{
  "amount": 50000,
  "currency": "INR",
  "receipt": "unique_receipt_id"
}
```

### POST `/verify`
Verifies payment signature
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

## 🧪 Testing

### Test Payment Details
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3-digit number
- **UPI**: success@razorpay
- **Wallet**: Any amount

### Test Scenarios
- ✅ Successful payments
- ✅ Failed payments
- ✅ Network errors
- ✅ Invalid amounts

## 🔮 Future Enhancements

- [ ] Payment history tracking
- [ ] PDF receipt generation
- [ ] Multi-currency support
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Dark/light theme toggle
- [ ] Payment retry mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

⭐ **Star this repository if you found it helpful!**