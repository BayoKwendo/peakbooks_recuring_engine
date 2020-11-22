import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createInvoice: async ({ customer_id, invoice_no, terms, due_date, invoice_date, message_invoice, statement_invoice }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVOICES}  SET
        customer_id=?, invoice_no=?, terms=?, due_date =?, invoice_date =?, message_invoice=?, statement_invoice=?`, [
            customer_id,
            invoice_no,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            statement_invoice
        ]);
        return result;
    },

    createEstimate: async ({ customer_id, estimate_no,  expiry_date, estimate_date, estimate_message, statement_message }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.ESTIMATES}  SET
        customer_id=?, estimate_no=?, expiry_date =?, estimate_date =?, estimate_message=?, statement_message=?`, [
            customer_id,
            estimate_no,  
            expiry_date,
            estimate_date,
            estimate_message,
            statement_message
        ]);
        return result;
    },

};