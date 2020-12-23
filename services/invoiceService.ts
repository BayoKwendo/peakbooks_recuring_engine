import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createInvoice: async ({ customer_id, invoice_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, created_by }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVOICES}  SET
        customer_id=?, invoice_no=?, terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?`, [
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
        created_by=? WHERE invoice_no = ?`, [
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
            created_by, invoice_no]);
        return query;
    },
    getInvoices: async ({ offset, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.terms, i.due_date, i.status, i.invoice_date, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
             i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.created_by = ? order by i.id DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getInvoiceFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.invoice_no = ?`, [filter_value]);
        return result;
    },

    getInvoiceFilterUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
            i.customer_id = ? AND i.status=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result;
    },
    getPageSizeInvoiceUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id
             WHERE i.customer_id = ? 
            AND i.status=0 AND i.created_by = ? `, [filter_value, created_by]);
        return result.count;
    },

    getPageSizeInvoice: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE created_by = ? `, [created_by]);
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