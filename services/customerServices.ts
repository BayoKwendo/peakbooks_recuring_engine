import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import Customers from "../interfaces/Customers.ts";

export default {
    createCustomer: async ({ client_id, customer_type, title, first_name, other_name, msisdn, email, company_name, customer_display_name, website }: Customers) => {
        const result = await client.query(`INSERT INTO ${TABLE.CUSTOMER}  SET
             client_id=?, customer_type=?, title=?, first_name =?, other_name =?, msisdn=?, email =?, company_name=?, customer_display_name=?, website=?`, [
            client_id,
            customer_type,
            title,
            first_name,
            other_name,
            msisdn,
            email,
            company_name,
            customer_display_name,
            website
        ]);
        return result;
    },

    createAddress: async ({
        customer_id, street, city_town, state_province, country, tax_info,
        notes, payment_method, delivery_method, terms, out_of_balance }: Customers) => {
        const result = await client.query(`INSERT INTO ${TABLE.CUSTOMER_MORE}
          SET
          customer_id=?, street=?, city_town=?, state_province=?, country=?, tax_info=?, 
          notes=?, payment_method=?, delivery_method=?, terms=?, out_of_balance=?`,
            [
                customer_id,
                street,
                city_town,
                state_province,
                country,
                tax_info,
                notes,
                payment_method,
                delivery_method,
                terms,
                out_of_balance
            ]);
        return result;
    },

    getAll: async ({ offset, client_id }: Customers) => {
        const query = await client.query(`SELECT * FROM ${TABLE.CUSTOMER} WHERE client_id = ? LIMIT ?,10`, [client_id, offset]);
        return query;
    },
    updateCustomerAll: async ({ client_id, customer_type, title, first_name, other_name, msisdn, email, company_name, customer_display_name, website, customer_id }: Customers,) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET 
        client_id=?, customer_type=?, title=?, first_name =?, other_name =?, msisdn=?, email =?, company_name=?, customer_display_name=?, website=?
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
            customer_display_name,
            website,
            customer_id
        ]);
        return query;
    },

    getCustomerMore: async ({ customer_id }: Customers) => {
        const query = await client.query(`SELECT * FROM ${TABLE.CUSTOMER_MORE} WHERE customer_id = ?`, [customer_id]);
        return query;
    },

    updateCustomerMore: async ({
        customer_id, street, city_town, state_province, country,
        street1, tax_info,
        notes, delivery_method, terms, out_of_balance
    }: Customers) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER_MORE} SET 
          street=?, 
          city_town=?,
          state_province=?, 
          country=?,
          tax_info=?,
          notes=?,
          delivery_method=?, 
          terms=?, 
          out_of_balance=?
          WHERE customer_id=?`,
            [
                street,
                city_town,
                state_province,
                country,
                tax_info,
                notes,
                delivery_method,
                terms,
                out_of_balance,
                customer_id
            ]);
        return query;
    },

    getCustomerFilter: async ({ filter_value }: Customers) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.CUSTOMER} WHERE email LIKE ? or msisdn LIKE ? or customer_display_name LIKE ?`, [filter_value, filter_value, filter_value]);
        return result;
    },


    getCustomerBalance: async ({ client_id, startDate,endDate }: Customers) => {
        const result = await client.query(
            `SELECT out_of_balance FROM  ${TABLE.CUSTOMER} b LEFT JOIN ${TABLE.CUSTOMER_MORE} c ON b.id = c.customer_id WHERE
             b.client_id = ${client_id} AND 
             b.created_at BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },


    getPageSizeCustomer: async ({ client_id }: Customers) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.CUSTOMER} WHERE client_id = ?`, [client_id]);
        return result.count;
    },
    updateCustomer: async ({ customer_id }: Customers,) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET status = 1 WHERE id = ? `, [customer_id]);
        return query;
    },


};