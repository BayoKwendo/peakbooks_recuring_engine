import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import User from "../interfaces/User.ts";

export default {
    createUser: async ({ first_name, last_name, msisdn, industry, role_id, email, password }: User,) => {
        const result = await client.query(`INSERT INTO Users SET
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

    userExist: async ({ email, msisdn }: User) => {
        const [result] = await client.query(
            `SELECT * FROM Users WHERE msisdn = ?`,
            [email, msisdn],
        );
        return result;
    },

    updateUser: async ({ password, email }: User,) => {
        const query = await client.query(`UPDATE users SET password = ? WHERE email = ? `, [password, email]);
        return query;
    },


};
