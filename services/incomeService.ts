import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Income from "../interfaces/Income.ts";


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
        const query = await client.query(`SELECT  DATE(TIME) as DATE, SUM(amount) HouseIncome FROM ${TABLE.INCOME} WHERE 
         date(TIME) GROUP BY DATE(TIME) 
        with ROLLUP ORDER BY DATE(TIME) DESC LIMIT ?, 10`, [offset]);
        return query;
    },
    getFilter: async ({ filter_value }: Income) => {
        return await client.query(`SELECT date(TIME) as DATE, SUM(amount) HouseIncome 
        FROM  ${TABLE.INCOME} WHERE  date(TIME) LIKE ? GROUP BY DATE(TIME) 
        with ROLLUP`, [filter_value]);
    },

    getNLArchives: async ({ offset }:Income) => {
        return await client.query(`SELECT count(*) over () total_page, reference AS Reference,
        providerIdentifier AS Identifier,amount AS Amount,description
         AS Description,DATE_FORMAT(DATE(timestamp), '%Y-%m-%d') Date,response AS Response,transactionNumber AS Transaction_no FROM NlrcArchive 
        WHERE DATE(timestamp) GROUP BY DATE(timestamp) ORDER BY DATE(timestamp) DESC LIMIT ?,10`, [offset]);
    },

    getNLArchivesFilter: async ({ filter_value }:Income) => {
        return await client.query(`SELECT count(*) over () total_page, reference AS Reference,
        providerIdentifier AS Identifier,amount AS Amount,description
         AS Description,DATE_FORMAT(DATE(timestamp), '%Y-%m-%d') Date,response AS Response,transactionNumber AS Transaction_no FROM NlrcArchive 
        WHERE DATE(timestamp) AND (DATE_FORMAT(DATE(timestamp), '%Y-%m-%d') LIKE ? OR reference LIKE ? OR transactionNumber LIKE ?  ) 
         GROUP BY DATE(timestamp) ORDER BY DATE(timestamp) DESC LIMIT 10`, [filter_value, filter_value, filter_value]);
    },

    getWallet: async ({ offset }:Income) => {
        return await client.query(`SELECT DATE(NOW()) AS _date, FORMAT(SUM(balance),2) AS _ewalletBalance
        FROM CustomerAccount LIMIT ?,10`, [offset]);
    },

    getWinLoss: async ({ offset }:Income) => {
        return await client.query(`SELECT HOUR, count(*) over () total_page,COUNT(id), SUM(Loss), SUM(Win), (100 * SUM(Loss)/COUNT(id)) Percent_Loss, (100 * SUM(Win)/COUNT(id))Percent_Win 
        FROM (
        SELECT HOUR(TIME) HOUR, id, IF((prediction = 0 OR probability = 0), 1 , 0) Loss, IF((prediction = 1 AND probability = 1), 1 , 0) Win FROM BetLog
        )
        AS tbl1 GROUP BY HOUR with rollup LIMIT ?,10`, [offset]);
    },

    getStake: async ({ offset }:Income) => {
        return await client.query(`SELECT DATE,  count(*) over () total_page,  BETTYPE,TOTALSTAKE 
        FROM 
        (   SELECT DATE(TIME) DATE, IF(TYPE="LUCKY GAME","LUCKYBOX",IF(TYPE="free","FREE",
        IF(TYPE="jackpot","JACKPOT",IF(TYPE="sure","SURE BET",IF(TYPE="LUCKYBOX","LUCKYBOX","--")))))
     AS BETTYPE,format(SUM(amount),2)
        TOTALSTAKE 
        FROM BetLog 
        GROUP BY DATE(TIME),TYPE
        )
        AS tbl1 
        WHERE DATE(DATE) order by DATE(DATE) DESC LIMIT ?,10`, [offset]);
    },
};