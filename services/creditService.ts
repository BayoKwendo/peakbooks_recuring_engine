import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Credit from "../interfaces/Credit.ts";

export default {

    createCrediNote: async ({ customer_id, credit_date, terms_condition, sub_total, customer_note, amount, due_amount, tax_amount, discount_amount, created_by }: Credit) => {
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
        status=1`, [
            customer_id,
            credit_date,
            terms_condition,
            sub_total,
            customer_note,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by
        ]);
        return result;
    },

    updatedCredit: async ({ customer_id, credit_date, terms_condition,credit_no, sub_total, customer_note, amount, due_amount, tax_amount, discount_amount, created_by }: Credit) => {
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
        status=1
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
            credit_no]);

        return result;
    },
    getCreditNote: async ({ offset, created_by }: Credit) => {
        const result = await client.query(
            `SELECT i.credit_no, i.credit_date,  i.status, i.customer_note,i.date_modified,i.terms_condition, i.reference, i.sub_total, i.tax_amount,
             i.due_amount, i.amount, c.customer_display_name, c.email, c.company_name  FROM 
            ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? order by i.date_modified DESC LIMIT ?,10`, [created_by, offset]);
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


};