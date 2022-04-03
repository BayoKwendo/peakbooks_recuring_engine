import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {


    getfrequency: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_INVOICE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },

    updateInvoiceStatus: async ({ status, id }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET status = 0 WHERE id = ${id}`
        )
    },

    getInvoiceFilter: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT invoice_no, client_id, terms FROM 
           invoices i inner join customers c on c.id = i.customer_id 
           WHERE i.estimate=0 and i.sales_order_no=0 and i.created_by = 699 AND i.invoice_no = 599;`, [created_by, filter_value]);
        return result;
    },


    getInvoiceItems: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.INVOICE_ITEMS} WHERE invoice_no = ? AND client_id = ?`, [filter_value, created_by]);
        return result;
    },

    createInvoice: async ({ customer_id, invoice_no, currency_type, sales_order_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, recurring, created_by, estimate, reference, agnaist_ksh, tax_exclusive, sales_person_id, approved }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVOICES}  SET
        customer_id=?, invoice_no = ?, terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?,
        statement_invoice=?,
        currency_type=?,
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        recurring=?,
        agnaist_ksh=?,
        created_by=?,
        estimate=?,
        sales_order_no = ?,
        tax_exclusive=?,
        sales_person_id=?,
        approved=?,
        reference=?`, [
            customer_id,
            invoice_no,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            sub_total,
            statement_invoice,
            currency_type,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            recurring,
            agnaist_ksh,
            created_by,
            estimate,
            sales_order_no,
            tax_exclusive,
            sales_person_id,
            approved,
            reference
        ]);
        return result;
    },

    getInvoices: async ({ offset, startDate, endDate, sales_order_no, created_by, estimate, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no,i.id, i.tax_exclusive, i.lock_reminder,i.currency_type, i.terms, i.approved,i.estimate_no, i.customer_id,
            CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount_invoice,
           
            DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) period,
           i.sales_order_no,
            i.due_date, i.currency_type, i.status, i.invoice_date, i.date_modified, i.discount_amount, i.recurring, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,

            i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
          
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            
            WHERE i.created_by = ${created_by} AND i.estimate = ${estimate} AND i.sales_order_no = ${sales_order_no}
              AND i.created_at BETWEEN ${startDate} AND ${endDate}
              
              order by i.invoice_no DESC, i.estimate_no DESC LIMIT ${offset},${page_size}`);
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


    getItems: async () => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ITEMS} WHERE NOW() > end_date AND expiry_status <> 1 AND status = 1`);
        return result;
    },

    updateItemsStatus: async ({ status, id }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.ITEMS} SET status = ${status} WHERE id = ${id}`
        )
    }

};