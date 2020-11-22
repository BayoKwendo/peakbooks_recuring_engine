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
        customer_id, street, city_town, state_province, country,
        street1, city_town1, state_province1, country1,
        notes, payment_method, delivery_method, terms, out_of_balance }: Customers) => {
        const result = await client.query(`INSERT INTO ${TABLE.CUSTOMER_MORE}
          SET
          customer_id=?, street=?, city_town=?, state_province=?, country=?,
          street1=?, city_town1=?, state_province1=?, country1=?, 
          notes=?, payment_method=?, delivery_method=?, terms=?, out_of_balance=?`,
            [
                customer_id,
                street,
                city_town,
                state_province,
                country,
                street1,
                city_town1,
                state_province1,
                country1,
                notes,
                payment_method,
                delivery_method,
                terms,
                out_of_balance
            ]);
        return result;
    },

    getAll: async ({ offset }:Customers) => {
        const query = await client.query(`SELECT * FROM ${TABLE.CUSTOMER} LIMIT ?,1000`, [offset]);
        return query;
    },

    updateCustomer: async ({ customer_id }: Customers,) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET status = 1 WHERE id = ? `, [customer_id]);
        return query;
    },


};