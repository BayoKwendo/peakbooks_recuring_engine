import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import Vendor from "../interfaces/Vendor.ts";

export default {
    createVendor: async ({ client_id, title, first_name, other_name,
        msisdn, email, company_name, vendor_display_name, website, street, city_town, state_province, country, street1,
        city_town1, state_province1, country1, remarks, terms, opening_balance }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.VENDORS}  SET
              client_id=?, title=?,
              first_name =?, other_name =?,
              msisdn=?, email =?, company_name=?,
              vendor_display_name=?, website=?, 
              street=?, city_town=?, state_province=?, country=?, 
              street1=?, city_town1=?, state_province1=?, country1=?, 
              remarks=?, terms=?, opening_balance=?`, [
            client_id,
            title,
            first_name,
            other_name,
            msisdn,
            email,
            company_name,
            vendor_display_name,
            website,
            street,
            city_town,
            state_province,
            country,
            street1,
            city_town1,
            state_province1,
            country1,
            remarks,
            terms,
            opening_balance
        ]);
        return result;
    },


    createExpense: async ({ client_id, date, expense_account, amount, paid_through, customer_id, vendor_id, billable, product_name, notes }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.EXPENSES}  SET
              client_id=?, date =?,
              expense_account=?, amount =?, paid_through=?,
              customer_id=?, vendor_id=?, 
              notes=?,billable=?,product=?`, [
            client_id, date, expense_account, amount, paid_through, customer_id, vendor_id, notes, billable, product_name
        ]);
        return result;
    },




    createRecurringExpense: async ({ start_time, end_time, customer_id, frequecy, vendor_id, created_by, frequency_type }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.RECURRING_EXPENSE}  SET
        start_time=?, 
        end_time =?, 
        customer_id =?,
        frequecy =?,
        frequency_type=?,
        created_by=?,
        vendor_id =?,
        last_updated = '1',
        status ='1'`, [
            start_time,
            end_time,
            customer_id,
            frequecy,
            frequency_type,
            created_by,
            vendor_id
        ]);
        return result;
    },

    // createAddress: async ({
    //     customer_id, street, city_town, state_province, country, tax_info,
    //     notes, payment_method, delivery_method, terms, out_of_balance }: Vendor) => {
    //     const result = await client.query(`INSERT INTO ${TABLE.CUSTOMER_MORE}
    //       SET
    //       customer_id=?, street=?, city_town=?, state_province=?, country=?, tax_info=?, 
    //       notes=?, payment_method=?, delivery_method=?, terms=?, out_of_balance=?`,
    //         [
    //             customer_id,
    //             street,
    //             city_town,
    //             state_province,
    //             country,
    //             tax_info,
    //             notes,
    //             payment_method,
    //             delivery_method,
    //             terms,
    //             out_of_balance
    //         ]);
    //     return result;
    // },

    getAll: async ({ offset, client_id }: Vendor) => {
        const query = await client.query(`SELECT * FROM ${TABLE.VENDORS} WHERE client_id = ? LIMIT ?,10`, [client_id, offset]);
        return query;
    },



    getExpenses: async ({ offset, client_id }: Vendor) => {
        const query = await client.query(`SELECT i.date, i.expense_account,  c.customer_display_name, v.vendor_display_name, i.paid_through,i.reference, i.billable,i.product,i.notes, i.amount
        FROM (( ${TABLE.EXPENSES} i
        INNER JOIN ${TABLE.VENDORS} v ON i.vendor_id = v.id)
        INNER JOIN ${TABLE.CUSTOMER} c ON i.customer_id = c.id) WHERE i.client_id = ? LIMIT ?,10`, [client_id, offset]);
        return query;
    },

    getPageSizeExpense: async ({ client_id }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.EXPENSES} WHERE client_id = ?`, [client_id]);
        return result.count;
    },

    getExpenseFilter: async ({ offset, client_id }: Vendor) => {
        const query = await client.query(`SELECT i.date, i.expense_account,  c.customer_display_name, v.vendor_display_name, i.paid_through,i.reference, i.billable,i.product,i.notes, i.amount
        FROM (( ${TABLE.EXPENSES} i
        INNER JOIN ${TABLE.VENDORS} v ON i.vendor_id = v.id)
        INNER JOIN ${TABLE.CUSTOMER} c ON i.customer_id = c.id) WHERE i.client_id = ? AND i.expense_ref=? LIMIT ?,10`, [client_id, offset]);
        return query;
    },

    getRecurringExpenses: async ({ offset, client_id }: Vendor) => {
        const query = await client.query(`SELECT i.date, i.expense_account, r.status,r.frequecy,r.expense_ref, c.customer_display_name,
         v.vendor_display_name, r.frequency_type, r.start_time, r.end_time, 
         i.paid_through,i.reference, i.billable,i.product,i.notes, i.amount
        FROM  ${TABLE.RECURRING_EXPENSE} r
        INNER JOIN ${TABLE.EXPENSES} i ON r.expense_ref = i.reference
        INNER JOIN ${TABLE.VENDORS} v ON r.vendor_id = v.id 
        INNER JOIN ${TABLE.CUSTOMER} c ON r.customer_id = c.id  WHERE r.created_by = ? LIMIT ?,10`, [client_id, offset]);
        return query;
    },

    getPageSizeExpenseRe: async ({ client_id }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.RECURRING_EXPENSE} WHERE created_by = ?`, [client_id]);
        return result.count;
    },


    getfrequencyExpense: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_EXPENSE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },


    updatefrequencyExpenses: async ({ frequecy, reference }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            frequecy = ?, 
            start_time = DATE_FORMAT(now(), "%Y-%m-%d %h:%i:%s")
            WHERE expense_ref = ? `,
            [frequecy, reference]);
        return result;
    },

    getRecurringExpeFilter: async ({ filter_value }: Vendor) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.EXPENSES} WHERE reference = ? `, [filter_value]);
        return result;
    },
    updateCustomerAll: async ({ client_id, customer_type, title, first_name, other_name, msisdn, email, company_name, vendor_display_name, website, customer_id }: Vendor) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET 
        client_id=?, customer_type=?, title=?, first_name =?, other_name =?, msisdn=?, email =?, company_name=?, vendor_display_name=?, website=?
        WHERE id = ?
        `, [
            client_id,
            customer_type,
            title,
            first_name,
            other_name,
            msisdn,
            email,
            company_name,
            vendor_display_name,
            website,
            customer_id
        ]);
        return query;
    },

    getCustomerMore: async ({ customer_id }: Vendor) => {
        const query = await client.query(`SELECT * FROM ${TABLE.CUSTOMER_MORE} WHERE customer_id = ?`, [customer_id]);
        return query;
    },

    // updateCustomerMore: async ({
    //     customer_id, street, city_town, state_province, country,
    //     street1, tax_info,
    //     notes, delivery_method, terms, out_of_balance
    // }: Vendor) => {
    //     const query = await client.query(`UPDATE ${TABLE.CUSTOMER_MORE} SET 
    //       street=?, 
    //       city_town=?,
    //       state_province=?, 
    //       country=?,
    //       tax_info=?,
    //       notes=?,
    //       delivery_method=?, 
    //       terms=?, 
    //       out_of_balance=?
    //       WHERE customer_id=?`,
    //         [
    //             street,
    //             city_town,
    //             state_province,
    //             country,
    //             tax_info,
    //             notes,
    //             delivery_method,
    //             terms,
    //             out_of_balance,
    //             customer_id
    //         ]);
    //     return query;
    // },

    getVendorFilter: async ({ filter_value }: Vendor) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.VENDORS} WHERE email LIKE ? or msisdn LIKE ? or customer_display_name LIKE ?`, [filter_value, filter_value, filter_value]);
        return result;
    },
    getPageSizeVendor: async ({ client_id }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.VENDORS} WHERE client_id = ?`, [client_id]);
        return result.count;
    },
    updateCustomer: async ({ customer_id }: Vendor) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET status = 1 WHERE id = ? `, [customer_id]);
        return query;
    },

    updatefrequencyexpensestatus: async ({ expense_ref }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            status = 0
            WHERE expense_ref = ?`,
            [expense_ref]);
        return result;
    },


    updatefrequencyexpensestatus2: async ({ expense_ref }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            status = 1
            WHERE expense_ref = ?`,
            [expense_ref]);
        return result;
    },


};