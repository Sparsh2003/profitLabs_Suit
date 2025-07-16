import mongoose from 'mongoose';

/**
 * Invoice Schema for Hotel Billing & Invoicing
 * Comprehensive folio management with line items and payments
 */
const invoiceSchema = mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true
  },
  
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: [true, 'Guest is required']
  },
  
  invoiceDate: {
    type: Date,
    required: [true, 'Invoice date is required'],
    default: Date.now
  },
  
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  
  lineItems: [{
    category: {
      type: String,
      enum: ['room', 'food', 'beverage', 'laundry', 'telephone', 'internet', 'spa', 'other'],
      required: [true, 'Line item category is required']
    },
    description: {
      type: String,
      required: [true, 'Line item description is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative']
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tax amount cannot be negative']
    },
    total: {
      type: Number,
      required: [true, 'Total is required']
    },
    date: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  summary: {
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      default: 0
    },
    totalTax: {
      type: Number,
      required: [true, 'Total tax is required'],
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      default: 0
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    }
  },
  
  payments: [{
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'online'],
      required: [true, 'Payment method is required']
    },
    reference: String,
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receivedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  status: {
    type: String,
    enum: ['draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  
  paymentStatus: {
    totalPaid: {
      type: Number,
      default: 0
    },
    outstandingBalance: {
      type: Number,
      default: 0
    },
    lastPaymentDate: Date
  },
  
  companyInfo: {
    name: {
      type: String,
      required: [true, 'Company name is required']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    contact: {
      phone: String,
      email: String,
      website: String
    },
    taxInfo: {
      gstNumber: String,
      panNumber: String
    }
  },
  
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ booking: 1 });
invoiceSchema.index({ guest: 1 });
invoiceSchema.index({ invoiceDate: 1 });
invoiceSchema.index({ status: 1 });

/**
 * Generate unique invoice number
 * @returns {string} - Unique invoice number
 */
invoiceSchema.statics.generateInvoiceNumber = function() {
  const prefix = 'INV';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}${year}${month}${timestamp}`;
};

/**
 * Calculate invoice summary
 */
invoiceSchema.methods.calculateSummary = function() {
  let subtotal = 0;
  let totalTax = 0;
  
  this.lineItems.forEach(item => {
    subtotal += item.subtotal;
    totalTax += item.taxAmount;
  });
  
  this.summary.subtotal = subtotal;
  this.summary.totalTax = totalTax;
  this.summary.totalAmount = subtotal + totalTax - this.summary.discounts;
  
  // Update payment status
  this.paymentStatus.totalPaid = this.payments.reduce((total, payment) => total + payment.amount, 0);
  this.paymentStatus.outstandingBalance = this.summary.totalAmount - this.paymentStatus.totalPaid;
  
  // Update status based on payment
  if (this.paymentStatus.totalPaid === 0) {
    this.status = 'pending';
  } else if (this.paymentStatus.totalPaid >= this.summary.totalAmount) {
    this.status = 'paid';
  } else {
    this.status = 'partially_paid';
  }
};

/**
 * Add line item to invoice
 * @param {Object} item - Line item object
 */
invoiceSchema.methods.addLineItem = function(item) {
  // Calculate subtotal and tax
  item.subtotal = item.quantity * item.unitPrice;
  item.taxAmount = item.subtotal * (item.taxRate / 100);
  item.total = item.subtotal + item.taxAmount;
  
  this.lineItems.push(item);
  this.calculateSummary();
};

/**
 * Add payment to invoice
 * @param {Object} payment - Payment object
 */
invoiceSchema.methods.addPayment = function(payment) {
  this.payments.push(payment);
  this.calculateSummary();
  
  // Update last payment date
  this.paymentStatus.lastPaymentDate = payment.receivedAt || new Date();
};

/**
 * Check if invoice is fully paid
 * @returns {boolean} - True if fully paid
 */
invoiceSchema.methods.isFullyPaid = function() {
  return this.paymentStatus.outstandingBalance <= 0;
};

/**
 * Check if invoice is overdue
 * @returns {boolean} - True if overdue
 */
invoiceSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'paid';
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;