import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import Vendor from "../interfaces/Vendor.ts";

export default {


    getfrequencyExpense: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_EXPENSE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },
    getRecurringExpeFilter: async ({ filter_value }: Vendor) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.EXPENSES} WHERE id = '${filter_value}' `);
        return result;
    },


   deleteExpenseRecurring: async ({ filter_value }: Vendor) => {
        const result = await client.query(
            `DELETE FROM  ${TABLE.RECURRING_EXPENSE} WHERE id = '${filter_value}' `);
        return result;
    },


    createExpense: async ({ client_id, date, expense_account, amount, paid_through, recurring, reference, customer_id, vendor_id, billable, product_name, notes, tax_amount }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.EXPENSES}  SET
              client_id=?, date =?,
              expense_account=?, amount =?, paid_through=?,
              customer_id=?, vendor_id=?, 
              notes=?,billable=?,product=?, tax_amount= ?,recurring=?, reference = ?`, [
            client_id, date, expense_account, amount, paid_through, customer_id,
            vendor_id, notes, billable, product_name, tax_amount, recurring, reference
        ]);
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
    }
};