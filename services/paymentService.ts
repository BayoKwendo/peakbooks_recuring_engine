import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Payment from "../interfaces/payments.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createPayment: async ({ name, client_id }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.PAYMENT_RECEIVED} SET
             name =?,
             created_by=?`, [
            name,
            client_id
        ]);
        return result;
    },

    getPayment: async ({ offset, page_size }: Payment) => {
        const result = await client.query(
            `SELECT name FROM ${TABLE.PAYMENT_RECEIVED} WHERE created_by order by id LIMIT ?,?`, [offset, page_size]);
        return result;
    },

    getPaymentFilter: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT name FROM  ${TABLE.ITEMS} WHERE name = ?`, [filter_value]);
        return result;
    },


    createDeposit_to: async ({ name, client_id }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.DEPOSIT_TO} SET
             name =?,
             created_by=?`, [
            name,
            client_id
        ]);
        return result;
    },

    getDeposit_to: async ({ offset, page_size }: Payment) => {
        const result = await client.query(
            `SELECT name FROM ${TABLE.DEPOSIT_TO} WHERE created_by order by id LIMIT ?,?`, [offset, page_size]);
        return result;
    },

    getDeposittoFilter: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT name FROM  ${TABLE.DEPOSIT_TO} WHERE name = ?`, [filter_value]);
        return result;
    },


    //Create Payment Received

    createPaymentReceived: async ({ customer_id, invoice_no, amount_received,
        payment_date, payment_mode, reference, notes, amount_inexcess, deposit_to }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.PAYMENT_RECEIVED_PAY}  SET
        customer_id=?,
        invoice_no=?,
        amount_received=?,
        payment_date =?,
        payment_mode =?,
        reference=?,
        notes=?,
        amount_inexcess=?,
        deposit_to=?`,
            [
                customer_id,
                invoice_no,
                amount_received,
                payment_date,
                payment_mode,
                reference,
                notes,
                amount_inexcess,
                deposit_to
            ]);
        return result;
    },

    //get payment recepp unprocessed

    getPaymentUnpaidrecord: async ({ customer_id }: Payment) => {
        const result = await client.query(
            `SELECT id FROM  ${TABLE.PAYMENT_RECEIVED_PAY} WHERE status = 0 and customer_id = ?`, [customer_id]);
        return result;
    },

    getPaymentUnpaidrecordbill: async ({ vendor_id }: Payment) => {
        const result = await client.query(
            `SELECT id FROM  ${TABLE.PAYMENT_RECEIVED_PAY_BILL} WHERE status = 0 and vendor_id = ?`, [vendor_id]);
        return result;
    },

    updatePaymentBillUnpaidrecord: async ({ vendor_id }: Payment) => {
        const query = await client.query(`UPDATE ${TABLE.PAYMENT_RECEIVED_PAY_BILL} SET 
        status = 1 
        WHERE status = 0 and vendor_id = ?`, [vendor_id]);
        return query;
    },


    updatePaymentUnpaidrecord: async ({ customer_id }: Payment) => {
        const query = await client.query(`UPDATE ${TABLE.PAYMENT_RECEIVED_PAY} SET 
        status = 1 
        WHERE status = 0 and customer_id = ?`, [customer_id]);
        return query;
    },




    // return payments made

    getPaymentReceivedUnpaid: async ({ offset, created_by }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, i.id, c.customer_display_name, i.invoice_no,i.payment_mode,i.amount_inexcess,i.amount_received FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ? AND i.status = 1 order by i.id DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getReceivedFilter: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, c.customer_display_name, i.invoice_no,i.payment_mode,i.amount_inexcess,i.amount_received FROM 
       ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.invoice_no = ?`, [filter_value]);
        return result;
    },

    getPageSizePaymentReceived: async ({ created_by }: Payment) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count  FROM 
            ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
             c.client_id = ? AND i.status = 1 `, [created_by]);
        return result.count;
    },

    createBill: async ({ vendor_id, terms, due_amount, due_date, bill_date, tax_inclusive, notes, sub_total, amount,
        tax_amount, discount_amount, recurring, created_by, estimate }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.BILLS}  SET
        vendor_id=?,terms=?, due_date =?, bill_date =?, notes=?,sub_total=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        tax_inclusive=?,
        recurring=?,
        created_by=?`, [
            vendor_id,
            terms,
            due_date,
            bill_date,
            notes,
            sub_total,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            tax_inclusive,
            recurring,
            created_by
        ]);
        return result;
    },
    createRecurringBill: async ({ bill_no, due_amount, start_time, end_time, vendor_id, frequecy, created_by, frequency_type }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.RECURRING_BILLS}  SET
        bill_no=?,
        due_amount=?,
        start_time=?, 
        end_time =?, 
        vendor_id =?,
        frequecy =?,
        frequency_type=?,
        created_by=?,
        last_updated = '1',
        status ='1'`, [
            bill_no,
            due_amount,
            start_time,
            end_time,
            vendor_id,
            frequecy,
            frequency_type,
            created_by
        ]);
        return result;
    },
    getPageSizeBill: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.BILLS} i inner join ${TABLE.VENDORS}
             c on c.id = i.vendor_id WHERE created_by = ?`, [created_by]);
        return result.count;
    },


    getBill: async ({ offset, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT i.bill_no, i.order_no, i.terms, i.due_date,i.due_amount, i.status, i.bill_date, i.date_modified, i.discount_amount, i.sub_total, i.tax_amount, i.notes,
              i.amount, c.vendor_display_name,c.email, c.company_name  FROM 
            ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
            WHERE i.created_by = ? order by i.date_modified DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getInvoiceFilter: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE i.created_by = ? AND i.bill-no = ?`, [created_by, filter_value]);
        return result;
    },
    getFrequencyBills: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.bill_no, i.start_time, i.end_time,i.due_amount, i.modified, i.status, i.frequecy, 
            i.frequency_type, c.vendor_display_name,c.email, c.company_name  FROM 
            ${TABLE.RECURRING_BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
            WHERE i.created_by = ? order by i.modified DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getPageSizeFrequencyBills: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.RECURRING_BILLS} i inner join ${TABLE.VENDORS}
             c on c.id = i.vendor_id WHERE created_by = ?`, [created_by]);
        return result.count;
    },
    getFrequencyBillsFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.RECURRING_BILLS} i inner join ${TABLE.CUSTOMER} c on c.id = i.vendor_id WHERE i.bill_no = ?`, [filter_value]);
        return result;
    },









    getFilterBillsUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
            i.vendor_id = ? AND i.status=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result;
    },


    getBillFilterPaidReceipt: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
             ${TABLE.BILLS} WHERE
           payment_received_id = ?`, [filter_value]);
        return result;
    },

    getPageSizeBillPaidReceipt: async ({ filter_value }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM 
            ${TABLE.INVOICES} WHERE
          payment_received_id = ? `, [filter_value]);
        return result.count;
    },
    getPageSizeBillUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM 
            ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
             i.vendor_id = ? AND i.status=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result.count;
    },


    createPaymentReceivedBill: async ({ vendor_id, bill_no, amount_received,
        payment_date, payment_mode, reference, order_no, notes, amount_inexcess, deposit_to }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.PAYMENT_RECEIVED_PAY_BILL}  SET
        vendor_id=?,
        bill_no=?,
        order_no=?,
        amount_received=?,
        payment_date =?,
        payment_mode =?,
        reference=?,
        notes=?,
        amount_inexcess=?,
        deposit_to=?`,
            [
                vendor_id,
                bill_no,
                order_no,
                amount_received,
                payment_date,
                payment_mode,
                reference,
                notes,
                amount_inexcess,
                deposit_to
            ]);
        return result;
    },


    //return paid payment for bils
    getPaymentReceivedpaidbills: async ({ offset, created_by }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, i.id, c.vendor_display_name, i.bill_no, i.payment_mode, i.amount_inexcess, i.amount_received FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
         c.client_id = ? AND i.status = 1 order by i.id DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getReceivedFilterBills: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, c.vendor_display_name, i.bill_no, i.payment_mode,i.amount_inexcess,i.amount_received FROM 
         ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE i.bill_no = ?`, [filter_value]);
        return result
    },
    getPageSizePaymentReceivedBills: async ({ created_by }: Payment) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count  FROM 
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
             WHERE
             c.client_id = ?`, [created_by]);
        return result.count;
    },
};
