import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import User from "../interfaces/User.ts";

export default {
    createUser: async ({ first_name, last_name, msisdn, industry, role_id, email, password }: User,) => {
        const result = await client.query(`INSERT INTO ${TABLE.USERS} SET
             first_name =?,
             last_name =?, msisdn=?, email =?, industry=?, role_id=?, password=?`, [
            first_name,
            last_name,
            msisdn,
            email,
            industry,
            role_id,
            password
        ]);
        return result;
    },
    loginUser: async ({ email }: User) => {
        const [result] = await client.query(
            `SELECT * FROM Users WHERE email = ?`,
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

    getClients: async ({ offset }: User) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.USERS} WHERE role_id = 2 ORDER BY id DESC LIMIT ?,10 `, [offset]);
            return result;
    },

    getPageSizeCLient: async ( ) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.USERS} WHERE role_id = 2`);
            return result.count;
    },

    getClientFilter: async ({ filter_value }: User) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.USERS} WHERE email LIKE ? or msisdn LIKE ?`, [filter_value, filter_value]);
            return result;
    },

    updatePassword: async ({ password,email }: User,) => {
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


};
