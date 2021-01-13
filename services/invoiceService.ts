import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createInvoice: async ({ customer_id, invoice_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, recurring, created_by, estimate }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVOICES}  SET
        customer_id=?,terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        recurring=?,
        created_by=?,
        estimate=?`, [
            customer_id,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            sub_total,
            statement_invoice,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            recurring,
            created_by,
            estimate
        ]);
        return result;
    },

    createRecurringInvoice: async ({ invoice_no, due_amount, start_time, end_time, customer_id, frequecy, created_by, frequency_type }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.RECURRING_INVOICE}  SET
        invoice_no=?,
        due_amount=?,
        start_time=?, 
        end_time =?, 
        customer_id =?,
        frequecy =?,
        frequency_type=?,
        created_by=?,
        last_updated = '1',
        status ='1'`, [
            invoice_no,
            due_amount,
            start_time,
            end_time,
            customer_id,
            frequecy,
            frequency_type,
            created_by
        ]);
        return result;
    },
    updateInvoice: async ({ customer_id, invoice_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, created_by }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} 
        SET
        customer_id=?, invoice_no=?, terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?
        WHERE invoice_no = ?`, [
            customer_id,
            invoice_no,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            sub_total,
            statement_invoice,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by,
            invoice_no]);
        return query;
    },

    convertEstimate: async ({ invoice_no }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} SET 
        estimate = 0
        WHERE invoice_no = ? `, [invoice_no]);
        return query;
    },


    getInvoices: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.terms, i.due_date, i.status, i.invoice_date, i.date_modified, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
             i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? AND i.estimate = ? order by i.date_modified DESC LIMIT ?,10`, [created_by, estimate, offset]);
        return result;
    },


    getFrequencyInvoices: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.start_time, i.end_time,i.due_amount, i.modified, i.status, i.frequecy, i.frequency_type, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? order by i.modified DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },

    getPageSizeFrequencyInvoice: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER}
             c on c.id = i.customer_id WHERE created_by = ?`, [created_by]);
        return result.count;
    },
    getFrequencyInvoicesFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.invoice_no = ?`, [filter_value]);
        return result;
    },

    updatefrequency: async ({ frequecy, invoice_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            frequecy = ?, 
            start_time = DATE_FORMAT(now(), "%Y-%m-%d %h:%i:%s")

            WHERE invoice_no = ? `,
            [frequecy, invoice_no]);
        return result;
    },

    updatefrequencystatus: async ({ invoice_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            status = 0
            WHERE invoice_no = ?`,
            [invoice_no]);
        return result;
    },


    updatefrequencystatus2: async ({ invoice_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            status = 1
            WHERE invoice_no = ?`,
            [invoice_no]);
        return result;
    },

    getfrequency: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_INVOICE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },


    getOneInvoices: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.terms, i.due_date, i.status, i.invoice_date, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
             i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? AND i.estimate = ?  AND i.email_sent = 0 order by i.date_modified LIMIT 1`, [created_by, estimate, offset]);
        return result;
    },

    getInvoiceFilter: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.created_by = ? AND i.invoice_no = ?`, [created_by, filter_value]);
        return result;
    },

    getInvoiceFilterUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
            i.customer_id = ? AND i.status=0 AND i.estimate=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result;
    },


    getInvoiceFilterPaidReceipt: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
             ${TABLE.INVOICES} WHERE
           payment_received_id = ?`, [filter_value]);
        return result;
    },

    getPageSizeInvoicePaidReceipt: async ({ filter_value }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM 
            ${TABLE.INVOICES} WHERE
          payment_received_id = ? `, [filter_value]);
        return result.count;
    },
    getPageSizeInvoiceUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id
             WHERE i.customer_id = ? 
            AND i.status=0 AND i.created_by = ? `, [filter_value, created_by]);
        return result.count;
    },

    getPageSizeInvoice: async ({ created_by, estimate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER}
             c on c.id = i.customer_id WHERE created_by = ?  AND estimate = ?`, [created_by, estimate]);
        return result.count;
    },
    createEstimate: async ({ customer_id, estimate_no, expiry_date, estimate_date, estimate_message,
        statement_message, sub_total, amount, due_amount, tax_amount,
        discount_amount, created_by }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.ESTIMATES}  SET
        customer_id=?, estimate_no=?, expiry_date =?, estimate_date =?, estimate_message=?, statement_message=?, sub_total=?,
        amount=?, due_amount=?,
        tax_amount=?, 
        discount_amount=?,
         created_by=?`, [
            customer_id,
            estimate_no,
            expiry_date,
            estimate_date,
            estimate_message,
            statement_message,
            sub_total,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by
        ]);
        return result;
    },


    updateEstimate: async ({ customer_id, estimate_no, expiry_date, estimate_date, estimate_message,
        statement_message, sub_total, amount, due_amount, tax_amount,
        discount_amount, created_by }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.ESTIMATES} SET 
        pdf = ? T
        customer_id=?, estimate_no=?, expiry_date =?, estimate_date =?, estimate_message=?, statement_message=?, sub_total=?,
        amount=?, due_amount=?,
        tax_amount=?, 
        discount_amount=?,
         created_by=?
        WHERE estimate_no = ? `, [customer_id,
            estimate_no,
            expiry_date,
            estimate_date,
            estimate_message,
            statement_message,
            sub_total,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by, estimate_no]);
        return query;
    },


    getEstimates: async ({ offset, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATES} WHERE created_by = ? LIMIT ?,10`, [offset, created_by]);
        return result;
    },

    getEstimateFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATES} WHERE estimate_no LIKE ?`, [filter_value]);
        return result;
    },

    getPageSizeEstimates: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.ESTIMATES} WHERE created_by = ?`, [created_by]);
        return result.count;
    },

    getInvoiceItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.INVOICE_ITEMS} WHERE invoice_no = ?`, [filter_value]);
        return result;
    },

    geteEstimateItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATE_ITEMS} WHERE estimate_no = ?`, [filter_value]);
        return result;
    },


};