import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import User from "../interfaces/User.ts";

export default {
    createUser: async ({ first_name, last_name, msisdn, industry, role_id, email, password,
        company_name, postal_address, first_time, our_client, paid, subscription, currency, currency_against_kenya, admin_role }: User,) => {
        const result = await client.query(`INSERT INTO ${TABLE.USERS} SET
             first_name =?,
             last_name =?, msisdn=?, email =?, industry=?, company_name=?, postal_address =?, 
             role_id=?, password=?, first_time=?, our_client=?, paid=?,subscription=?, status=1,currency=?,currency_against_kenya=?, admin_role = ?`, [
            first_name,
            last_name,
            msisdn,
            email,
            industry,
            company_name,
            postal_address,
            role_id,
            password,
            first_time,
            our_client,
            paid,
            subscription,
            currency,
            currency_against_kenya,
            admin_role
        ]);
        return result;
    },
    loginUser: async ({ email }: User) => {
        const [result] = await client.query(
            `SELECT * FROM users WHERE email = ?`,
            [email],
        );
        return result;
    },


    checkActive: async ({ email }: User) => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.USERS} WHERE email = ? AND status = 1`,
            [email],
        );
        return result;
    },

    userExist: async ({ email, msisdn }: User) => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.USERS} WHERE msisdn = ?`,
            [email, msisdn],
        );
        return result;
    },


    optsave: async ({ code, msisdn, expired }: User) => {
        const result = await client.query(
            `INSERT INTO  ${TABLE.VERIFICATION} SET msisdn=?, code=?, verified= 0, expired =?  `,
            [msisdn, code, expired],
        );
        return result;
    },


    getOTP: async ({ code, msisdn }: User) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM ${TABLE.VERIFICATION} WHERE msisdn=? AND code=? AND status = 0`,
            [msisdn, code],
        );
        return result.count;
    },

    updateVerify: async ({ code, msisdn }: User) => {
        const result = await client.query(
            `UPDATE ${TABLE.VERIFICATION} SET  verified = 1 WHERE msisdn=? AND code=?`,
            [msisdn, code],
        );
        return result;
    },

    getClients: async ({ offset }: User) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.USERS} WHERE role_id = 2 ORDER BY id DESC LIMIT ?,10 `, [offset]);
        return result;
    },

    getPageSizeCLient: async () => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.USERS} WHERE role_id = 2`);
        return result.count;
    },

    getClientFilter: async ({ filter_value }: User) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.USERS} WHERE email LIKE ? or msisdn LIKE ? or id = ?`, [filter_value, filter_value, filter_value]);
        return result;
    },

    updatePassword: async ({ password, email }: User,) => {
        const query = await client.query(`UPDATE ${TABLE.USERS} SET 
            account_status = 1,
            password = ? 
            WHERE email = ? `, [password, email]);
        return query;
    },


    activateAccount: async ({ id }: User,) => {
        const query = await client.query(`UPDATE ${TABLE.USERS} SET status = 1 WHERE id = ? `, [id]);
        return query;
    },

    deactiveAccount: async ({ id }: User,) => {
        const query = await client.query(`UPDATE  ${TABLE.USERS} SET status = 0 WHERE id = ? `, [id]);
        return query;
    },

    updateUser: async ({ password, email }: User,) => {
        const query = await client.query(`UPDATE  ${TABLE.USERS} SET password = ? WHERE email = ? `, [password, email]);
        return query;
    },

    //update organization profile
    updateUserCurrency: async ({ currency, company_name, business_pin, financial_year, msisdn, id }: User,) => {
        const query = await client.query(`UPDATE  ${TABLE.USERS} SET currency = ?, company_name = ?, business_pin=?,financial_year = ?,msisdn=?
         WHERE id = ? `, [currency, company_name, business_pin, financial_year, msisdn, id]);
        return query;
    },


};
