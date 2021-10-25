import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Credit from "../interfaces/Credit.ts";

export default {

    createCrediNote: async ({ customer_id, credit_date, terms_condition, sub_total,
        customer_note, amount, due_amount, tax_amount, discount_amount, status, created_by, tax_exclusive }: Credit) => {
        const result = await client.query(`INSERT INTO ${TABLE.CREDIT_NOTE}  SET
        customer_id=?, 
        credit_date =?, 
        terms_condition=?,
        sub_total=?, 
        customer_note=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive = ?,
        status=?`, [
            customer_id,
            credit_date,
            terms_condition,
            sub_total,
            customer_note,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by,
            tax_exclusive,
            status
        ]);
        return result;
    },

    updatedCredit: async ({ customer_id, status, credit_date, terms_condition, credit_no, sub_total, customer_note, amount,
        due_amount, tax_amount, discount_amount, created_by, tax_exclusive }: Credit) => {
        const result = await client.query(`UPDATE ${TABLE.CREDIT_NOTE} 
        SET
        customer_id=?, 
        credit_date =?, 
        terms_condition=?,
        sub_total=?, 
        customer_note=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive = ?,
        status=?
        WHERE credit_no = ?`, [
            customer_id,
            credit_date,
            terms_condition,
            sub_total,
            customer_note,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by,
            tax_exclusive,
            status,
            credit_no]);

        return result;
    },

    updatedCreditStatus: async ({
        due_amount, credit_no }: Credit) => {
        const result = await client.query(`UPDATE ${TABLE.CREDIT_NOTE} 
        SET
        due_amount=?,
        status=1
        WHERE credit_no = ?`, [
            due_amount,
            credit_no]);
        return result;
    },

    updatedfrequesymeter: async ({
        due_amount, credit_no }: Credit) => {
        const result = await client.query(`UPDATE ${TABLE.CREDIT_NOTE} 
        SET
        frequecy = ?,
        frequency_type = ?,
        status=1
        WHERE credit_no = ?`, [
            due_amount,
            credit_no]);
        return result;
    },


    getCreditNote: async ({ offset, created_by, page_size }: Credit) => {
        const result = await client.query(
            `SELECT i.credit_no, i.credit_date, i.tax_exclusive,i.discount_amount,  i.status, i.customer_note,
            i.date_modified,i.terms_condition, i.reference,i.customer_id, i.sub_total, i.tax_amount,
             i.due_amount, i.amount, c.customer_display_name, c.email, c.company_name  FROM 
            ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? order by i.date_modified DESC LIMIT ?,10`, [created_by, offset, page_size]);
        return result;
    },



    getCreditNoteReport: async ({ startDate, endDate, page_size, offset, created_by }: Credit) => {
        const result = await client.query(
            `SELECT i.credit_no,
              CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) credit_amount,

            i.credit_date,  i.status, i.customer_note,i.date_modified,i.terms_condition, i.reference, i.sub_total, i.tax_amount,
             i.due_amount, i.amount, c.customer_display_name, c.email, c.company_name  FROM 
            ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ${created_by} AND i.created_at BETWEEN ${startDate} AND ${endDate} order by i.date_modified DESC LIMIT ${offset},${page_size}`);
        return result;
    },

    getCreditNoteReportSize: async ({ startDate, endDate, page_size, offset, created_by }: Credit) => {
        const [result] = await client.query(
            `SELECT COUNT(i.credit_no) count  FROM 
            ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ${created_by} AND i.created_at BETWEEN ${startDate} AND ${endDate}`);
        return result.count;
    },

    // getPaymentReceivedReportsSize: async ({ created_by, startDate, endDate }: Invoices) => {
    //     const [result] = await client.query(
    //         `SELECT COUNT(i.id) count FROM 
    //     ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
    //      c.client_id = ${created_by} AND i.status = 1 AND i.created BETWEEN ${startDate} AND ${endDate}`);
    //     return result.count;
    // },



    createCrediNoteVendor: async ({ vendor_id, credit_date, sub_total, notes, amount, due_amount, tax_amount, discount_amount, created_by, tax_exclusive }: Credit) => {
        const result = await client.query(`INSERT INTO ${TABLE.CREDIT_NOTE_VENDOR}  SET
        vendor_id=?, 
        credit_date =?, 
        sub_total=?, 
        notes=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive = ?,
        status=1`, [
            vendor_id,
            credit_date,
            sub_total,
            notes,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by,
            tax_exclusive
        ]);
        return result;
    },
    //updatevendor credit
    updatedCreditVendor: async ({ vendor_id, credit_date, credit_no, sub_total, notes, amount,
        due_amount, tax_amount, discount_amount, created_by, tax_exclusive }: Credit) => {
        const result = await client.query(`UPDATE ${TABLE.CREDIT_NOTE_VENDOR} 
        SET
        vendor_id=?, 
        credit_date =?, 
        sub_total=?, 
        notes=?,
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive = ?,
        status=1
        WHERE credit_no = ?`, [
            vendor_id,
            credit_date,
            sub_total,
            notes,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by,
            tax_exclusive,
            credit_no]);

        return result;
    },

    // getOneInvoices: async ({ offset, created_by, estimate }: Invoices) => {
    //     const result = await client.query(
    //         `SELECT i.invoice_no, i.terms, i.due_date, i.status, i.invoice_date, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
    //          i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
    //         ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
    //         WHERE i.created_by = ? AND i.estimate = ?  AND i.email_sent = 0 order by i.date_modified LIMIT 1`, [created_by, estimate, offset]);
    //     return result;
    // },

    getCreditFilter: async ({ filter_value }: Credit) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.credit_no = ?`, [filter_value]);
        return result;
    },



    getPageSizeCredit: async ({ created_by }: Credit) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER}
             c on c.id = i.customer_id WHERE created_by = ? `, [created_by]);
        return result.count;
    },

    getCreditItems: async ({ filter_value }: Credit) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.CREDIT_ITEMS} WHERE credit_no = ?`, [filter_value]);
        return result;
    },







    getCreditVendorNote: async ({ offset, created_by }: Credit) => {
        const result = await client.query(
            `SELECT i.credit_no, i.vendor_id, i.credit_date,i.tax_exclusive, i.status, i.notes,i.date_modified, i.reference, i.sub_total, i.tax_amount,
             i.due_amount, i.amount, c.vendor_display_name, c.email, c.company_name  FROM 
            ${TABLE.CREDIT_NOTE_VENDOR} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
            WHERE i.created_by = ? order by i.date_modified DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },



    getCreditVendorFilter: async ({ filter_value }: Credit) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.CREDIT_NOTE_VENDOR} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE i.credit_no = ?`, [filter_value]);
        return result;
    },



    getPageSizeVendorCredit: async ({ created_by }: Credit) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.CREDIT_NOTE_VENDOR} i inner join ${TABLE.VENDORS}
             c on c.id = i.vendor_id WHERE created_by = ? `, [created_by]);
        return result.count;
    },

    getCreditVendorItems: async ({ filter_value }: Credit) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.CREDIT_NOTE_ITEMS} WHERE credit_no = ?`, [filter_value]);
        return result;
    },





};