import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Income from "../interfaces/Income.ts";
import Employee from "../interfaces/Employee.ts";

export default {
    doesExistById: async ({ id }: Income) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM ${TABLE.INCOME} WHERE id = ? LIMIT 1`,
            [id],
        );
        return result.count > 0;
    },

    getCounts: async () => {
        const [result] = await client.query(
            `SELECT Count(HouseIncome) customer 
            FROM ( SELECT DATE(TIME) DATE, SUM(amount) HouseIncome FROM ${TABLE.INCOME} WHERE  date(TIME) GROUP BY DATE(TIME) 
            with ROLLUP) AS h `);
        return result;
    },
    getAll: async ({ offset }:Income) => {
        const query = await client.query(`SELECT DATE(time) date, SUM(amount) total_deposits 
        FROM DepositRequest WHERE DATE(time) and  STATUS="Success" GROUP BY DATE(time) ORDER BY DATE(time) DESC LIMIT ?,1000`, [offset]);
        return query;
    },

    getPayStack: async () => {
        const query = await client.query(`SELECT DATE(TIME)
        date, COUNT(id) count, SUM(amount) amount
        FROM DepositRequest 
        WHERE DATE(TIME) AND platform = "Paystack" AND LOWER(STATUS) LIKE "success%"
        GROUP BY DATE(TIME) ORDER BY DATE(TIME) DESC LIMIT 0, 1000`);
        return query;
    },


    getDespositRequests: async ({ offset }:Income) => {
        const query = await client.query(`SELECT count(*) over () total_page, d.platform,c.email, d.amount,d.status,  d.transactionId,  d.time, c.msisdn
        FROM DepositRequest d LEFT JOIN CustomerAccount c ON d.customerAccountId = c.id WHERE  d.status = 'failed' or d.status = "initiated"
        ORDER BY DATE(TIME) DESC LIMIT ?, 10`, [offset]);
        return query;
    },

    getDespositFilter: async ({ offset, filter_value }:Income) => {
        const query = await client.query(`SELECT count(*) over () total_page,c.email, d.platform, d.amount,d.status,  d.transactionId,  d.time, c.msisdn
        FROM DepositRequest d LEFT JOIN CustomerAccount c ON d.customerAccountId = c.id WHERE c.msisdn = ? or c.email = ?
        ORDER BY DATE(TIME) DESC LIMIT ?, 10`, [filter_value, filter_value,offset]);
        return query;
    },

    getFilter: async ({ filter_value }: Income) => {
        return await client.query(`SELECT date(TIME) as DATE, SUM(amount) HouseIncome 
        FROM  ${TABLE.INCOME} WHERE  date(TIME) LIKE ? GROUP BY DATE(TIME) 
        with ROLLUP`, [filter_value]);
    },
    getMTNDeposit: async () => {
        return await client.query(`SELECT DATE(TIME)
        date, COUNT(id) count, SUM(amount) amount
        FROM DepositRequest
        WHERE DATE(TIME) AND platform = "MTN Airtime"
        GROUP BY DATE(TIME) ORDER BY DATE(TIME) DESC LIMIT 0, 10000`);
    },

    getMTNDepositRates: async ({ offset }: Employee)=> {
        return await client.query(`SELECT IF(grouping(DATE(date_created)), "Total", DATE(date_created)) DATE, IF(grouping(STATUS), "total", IFNULL(STATUS, "Unconfirmed")) STATUS, COUNT(id) COUNT, SUM(amount) Amount 
        FROM MtnDepositRequest m
        WHERE DATE(date_created) = CURDATE()
        GROUP BY DATE(date_created), m.status 
        WITH ROLLUP ORDER BY DATE(date_created) DESC LIMIT ?, 10`, [offset]);
    },

    getMTNRatesCount: async () => {
        const [result] = await client.query(
            `SELECT COUNT(DATE(date_created)) customer FROM MtnDepositRequest m WHERE DATE(date_created) GROUP BY DATE(date_created), m.status 
            WITH ROLLUP ORDER BY DATE(date_created)`);
        return result;
    },

    getMTNDepositRatesFilter:  async ({ filter_value }: Employee) => {
        return await client.query(`SELECT IF(grouping(DATE(date_created)), "Total", DATE(date_created)) DATE, IF(grouping(STATUS), "total", IFNULL(STATUS, "Unconfirmed")) STATUS, COUNT(id) COUNT, SUM(amount) Amount 
        FROM MtnDepositRequest m
        WHERE DATE(date_created) LIKE ?
        GROUP BY DATE(date_created), m.status 
        WITH ROLLUP ORDER BY DATE(date_created) DESC LIMIT 10`,  [filter_value]);
    },

    getDailyIncome: async () => {
        return await client.query(`SELECT DATE(date_created) date, COUNT(id) withdrawal_count, SUM(amount) total_withdrawals
        FROM Transaction WHERE lower(status) = "success" and  date(date_created)  GROUP BY DATE(date_created) with rollup ORDER BY 
        DATE(date_created) DESC LIMIT 0, 10000`);
    },
    
    getCustomerWidrawals: async ({ offset }: Employee) => {
        return await client.query(`SELECT *,  count(*) over () total_page
        FROM WithdrawalArchive ORDER BY id DESC LIMIT ?, 10`,  [offset]);
    },

    getCustomerFilter: async ({ offset, filter_value }: Employee) => {
        return await client.query(`SELECT *,  count(*) over () total_page
        FROM WithdrawalArchive WHERE msisdn = ? OR transactionId = ? OR status = ? 
        or DATE_FORMAT(time, '%Y-%m-%d') LIKE ?  ORDER BY id DESC Limit ?, 10`, [filter_value, 
            filter_value,filter_value, filter_value,offset]);
    },



    getCustomerTransaction: async ({ offset }: Employee) => {
        return await client.query(`SELECT *,  count(*) over () total_page
        FROM Transaction ORDER BY id DESC LIMIT ?, 10`,  [offset]);
    },

    getTransactionFilter: async ({ offset, filter_value }: Employee) => {
        return await client.query(`SELECT *,  count(*) over () total_page
        FROM Transaction WHERE msisdn = ? OR reference = ? OR status = ? 
        or DATE_FORMAT(date_created, '%Y-%m-%d') LIKE ?  ORDER BY id DESC Limit ?, 10`, [filter_value, 
            filter_value,filter_value, filter_value,offset]);
    },
    
    getPayCode: async () => {
        return await client.query(`SELECT transactionId as Id, msisdn as Mobile, amount as Amount, DATE(TIME) DATE
        FROM PaycodeWithdrawalArchive
        WHERE date(TIME) and authorized=1 AND cancelled=0 AND reversed=0
        GROUP BY DATE(TIME)`);
    }
};