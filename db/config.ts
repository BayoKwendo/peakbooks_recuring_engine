export const DATABASE: string = "";

// export const MYSQL ={
//     host: "157.230.229.119",
//     user: "root",
//     password: "VF3ax6geGdfg32dufgf8",
//     database: "peakbooks",
//     port:10330

// }

export const MYSQL = {
  host: "localhost",
  user: "root",
  password: "part@^yr9053",
  database: "peakbooks",
  port: 3306
}

export const SMS_BaseUrl: string = "http://localhost:1200/send_sms"; // base url for sms services

export const SMS_BaseUrl_2: string = "http://localhost:1200/send_sms_mobitech"; // base url for sms services mobitech

export const SMS = {
  URL: 'https://api.vaspro.co.ke/v3/BulkSMS/api/create',
  APIKEY: '8f15430edfeb253fb0961c36e0fee0cc',
  SENDERID: 'PEAKBOOKS',
  CALL_BACK: 'https://api.vaspro.co.ke'
};

export const CONFIG = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}


export const TABLE = {
  CUSTOMER: "customers",
  CUSTOMER_MORE: "customers_more",
  USERS: "users",
  INVOICES: "invoices",
  ESTIMATES: "estimates",
  SMS_LOGS: 'sms_logs',
  INVOICE_ITEMS: "invoice_items",
  ESTIMATE_ITEMS: "estimate_items",
  ITEMS: "items",
  INCOME: "Uscers",
  MEASUREMENTS: "item_measurements",
  BUDGET: "budget",
  PAYMENT_RECEIVED: "payment_method",
  CASH_BANK: "cash_bank",
  BANK: "bank",
  DEPOSIT_TO: "deposit_to",
  PAYMENT_RECEIVED_PAY: "payment_received",
  PAYMENT_RECEIVED_PAY_BILL: "payment_received_bills",
  RECURRING_INVOICE: "recurring_invoices",
  CREDIT_NOTE: "credit_note",
  CREDIT_NOTE_VENDOR: "credit_note_vendor",
  CREDIT_NOTE_ITEMS: "credit_items_vendor",
  BILL_ITEMS: "bill_items",
  SALES_PERSON: "sales_person",
  INVESTMENT: "investments",
  VERIFICATION: "verification",
  CREDIT_ITEMS: "credit_items",
  VENDORS: "vendors",
  EXPENSES: "expenses",
  RECURRING_EXPENSE: "recurring_expenses",
  BILLS: "billings",
  RECURRING_BILLS: 'recurring_bills',
  TAX_RATES: 'tax_rates',
  PASSWORD_RESET: 'password_reset',
  DOCUMENTS: 'documents',
  JOURNAL_ITEMS: 'journal_items',
  JOURNALS: 'journals',
  EXPENSE_ACCOUNT: 'expense_account',

  CURRENCY: 'currency',

  MPESA_PAYMENT: 'mpesa_payments'

};
