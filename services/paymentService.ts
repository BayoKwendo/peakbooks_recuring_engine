import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Payment from "../interfaces/payments.ts";

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


    updatePaymentUnpaidrecord: async ({ customer_id }: Payment) => {
        const query = await client.query(`UPDATE ${TABLE.PAYMENT_RECEIVED_PAY} SET 
        status = 1 
        WHERE status = 0 and customer_id = ?`, [customer_id]);
        return query;
    },


    // return payments made

    getPaymentReceivedUnpaid: async ({ offset, created_by }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, c.customer_display_name, i.invoice_no,i.payment_mode,i.amount_inexcess,i.amount_received FROM 
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


};
