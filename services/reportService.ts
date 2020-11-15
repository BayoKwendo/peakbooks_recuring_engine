import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import  Report from "../interfaces/Report.ts";


export default {
    doesExistById: async ({ id }: Report) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM ${TABLE.INCOME} WHERE id = ? LIMIT 1`,
            [id],
        );
        return result.count > 0;
    },

    getCounts: async () => {
        const [result] = await client.query(
            `SELECT COUNT(DATE) customer  
            FROM
        (SELECT DATE(time) DATE,COUNT(id) NoOfBets,SUM(amount) TOTALSTAKE,SUM(IF(prediction=1 and probability=1,
        (reservation-amount),0)) PAYOUTS,SUM(IF(type="LUCKYBOX" , (amount),0)) LUCKYBOX,SUM(IF(type = "luckyplayer", 
        (amount),0)) LUCKYPLAYER ,SUM(IF(type="sure" , (amount),0)) SUREBET,SUM(IF(type = "jackpot", (amount),0)) JACKPOT 
        FROM BetLog    GROUP BY DATE(time) ) as tbl1 
        WHERE DATE(DATE)`);
        return result;
    },
    getAll: async ({ offset }:Report) => {
        const query = await client.query(`SELECT  DATE_FORMAT(DATE, '%Y-%m-%d') DATE, NOOFBETS, TOTALSTAKE,PAYOUTS,LUCKYBOX,LUCKYPLAYER,JACKPOT,SUREBET  
        FROM
        (SELECT DATE(time) DATE,COUNT(id) NoOfBets,SUM(amount) TOTALSTAKE,SUM(IF(prediction=1 and probability=1,
        (reservation-amount),0)) PAYOUTS,SUM(IF(type="LUCKYBOX" , (amount),0)) LUCKYBOX,SUM(IF(type = "luckyplayer", 
        (amount),0)) LUCKYPLAYER ,SUM(IF(type="sure" , (amount),0)) SUREBET,SUM(IF(type = "jackpot", (amount),0)) JACKPOT 
        FROM BetLog    GROUP BY DATE(time) ) as tbl1 
        WHERE DATE(DATE) ORDER BY DATE(DATE) DESC LIMIT ?, 20`, [offset]);
        return query;
    },


    getCountEod: async () => {
        const [result] = await client.query(
            `SELECT COUNT(datem) customer 
            FROM (
            SELECT DATE(time) datem, IF(type="luckybox","LUCKYBOX",IF(type="LUCKYPLAYER","LUCKYPLAYER",
            IF(type="jackpot","JACKPOT",if(type="sure","SURE BET","--")))) AS BETTYPE,
            COUNT(id) NOBETS,SUM(amount) TOTALSTAKE, SUM(IF(probability=1 and prediction=1, (reservation-amount),0)) PAYOUTS
            FROM BetLog 
            GROUP BY DATE(time),type WITH ROLLUP) 
            AS tbl1 WHERE DATE(datem)`);
        return result;
    },

    getJackPots: async () => {
        const result = await client.query(
            `SELECT DATE(TIME) date,name,msisdn,format(amount,2) amount 
            FROM JackpotWinner 
            WHERE id>2 and date(time)`);
        return result;
    },

    otherWinners: async () => {
        const result = await client.query(
            ` SELECT DATE(cl.time) date ,c.firstName  name ,c.msisdn msisdn,cl.amount amount
            from CustomerAccountLog cl,CustomerAccount c WHERE LEFT(cl.narrative,3)="Won" AND cl.amount>=1000
            AND cl.amount<=4999
            AND c.id=cl.customerAccountId and date(cl.time)
            ORDER BY DATE(cl.time) DESC`);
        return result;
    },

   
    avarageBet: async () => {
        const result = await client.query(
            `SELECT DATE, NOOFBETS, TOTALSTAKE,PAYOUTS,LUCKYBOX,LUCKYPLAYER,JACKPOT,SUREBET  
            FROM
            (SELECT DATE(time) DATE,COUNT(id) NoOfBets,SUM(amount) TOTALSTAKE,SUM(IF(prediction=1 and probability=1,
            (reservation-amount),0)) PAYOUTS,SUM(IF(type="LUCKYBOX" , (amount),0)) LUCKYBOX,SUM(IF(type = "luckyplayer", 
            (amount),0)) LUCKYPLAYER ,SUM(IF(type="sure" , (amount),0)) SUREBET,SUM(IF(type = "jackpot", (amount),0)) JACKPOT 
            FROM BetLog    GROUP BY DATE(time) ) as tbl1 
            WHERE DATE(DATE) LIMIT 100`);
        return result;
    },

    getBetPerHour: async ({ offset }:Report) => {
        const query = await client.query(`SELECT DATE(TIME), HOUR(TIME), COUNT(id) FROM BetLog
         GROUP BY DATE(TIME) , HOUR(TIME)  LIMIT ?, 10`, [offset]);
        return query;
    },



    
    getFilterEod: async ({ filter_value }: Report) => {
        return await client.query(`SELECT DATE_FORMAT(datem, '%Y-%m-%d') datem,  BETTYPE,NOBETS,TOTALSTAKE, PAYOUTS 
        FROM (
        SELECT DATE(time) datem, IF(type="luckybox","LUCKYBOX",IF(type="LUCKYPLAYER","LUCKYPLAYER",
        IF(type="jackpot","JACKPOT",if(type="sure","SURE BET","--")))) AS BETTYPE,
        COUNT(id) NOBETS,SUM(amount) TOTALSTAKE, SUM(IF(probability=1 and prediction=1, (reservation-amount),0)) PAYOUTS
        FROM BetLog 
        GROUP BY DATE(time),type WITH ROLLUP) 
        AS tbl1 WHERE DATE(datem) LIKE ? LIMIT 50`, [filter_value]);
    },

    getPayStack: async () => {
        const query = await client.query(`SELECT DATE(TIME)
        date, COUNT(id) count, SUM(amount) amount
        FROM DepositRequest 
        WHERE DATE(TIME) AND platform = "Paystack" AND LOWER(STATUS) LIKE "success%"
        GROUP BY DATE(TIME) ORDER BY DATE(TIME) DESC LIMIT 0, 100`);
        return query;
    },
    getFilter: async ({ filter_value }: Report) => {
        return await client.query(`SELECT  DATE_FORMAT(DATE, '%Y-%m-%d') DATE, NOOFBETS, TOTALSTAKE,PAYOUTS,LUCKYBOX,LUCKYPLAYER,JACKPOT,SUREBET  
        FROM
        (SELECT DATE(time) DATE,COUNT(id) NoOfBets,SUM(amount) TOTALSTAKE,SUM(IF(prediction=1 and probability=1,
        (reservation-amount),0)) PAYOUTS,SUM(IF(type="LUCKYBOX" , (amount),0)) LUCKYBOX,SUM(IF(type = "luckyplayer", 
        (amount),0)) LUCKYPLAYER ,SUM(IF(type="sure" , (amount),0)) SUREBET,SUM(IF(type = "jackpot", (amount),0)) JACKPOT 
        FROM BetLog    GROUP BY DATE(time) ) as tbl1 
        WHERE DATE(DATE) LIKE ? LIMIT 50`, [filter_value]);
    },
    getEod: async ({ offset }:Report) => {
        return await client.query(`SELECT DATE_FORMAT(datem, '%Y-%m-%d') datem,  BETTYPE,NOBETS,TOTALSTAKE, PAYOUTS 
        FROM (
        SELECT DATE(time) datem, IF(type="luckybox","LUCKYBOX",IF(type="LUCKYPLAYER","LUCKYPLAYER",
        IF(type="jackpot","JACKPOT",if(type="sure","SURE BET","--")))) AS BETTYPE,
        COUNT(id) NOBETS,SUM(amount) TOTALSTAKE, SUM(IF(probability=1 and prediction=1, (reservation-amount),0)) PAYOUTS
        FROM BetLog 
        GROUP BY DATE(time),type WITH ROLLUP) 
        AS tbl1 WHERE DATE(datem) ORDER BY DATE(datem) DESC LIMIT ?, 20`, [offset] );
    },
    getMTNDepositRates: async () => {
        return await client.query(`SELECT IF(grouping(DATE(date_created)), "Total", DATE(date_created)) DATE, IF(grouping(STATUS), "total", IFNULL(STATUS, "Unconfirmed")) STATUS, COUNT(id) COUNT, SUM(amount) Amount 
        FROM MtnDepositRequest m
        WHERE DATE(date_created)
        GROUP BY DATE(date_created), m.status 
        WITH ROLLUP ORDER BY DATE(date_created) DESC LIMIT 0, 10000`);
    },

    getDailyBet: async () => {
        return await client.query(`SELECT DATE(TIME) date, COUNT(id) withdrawal_count, SUM(amount) total_withdrawals
        FROM WithdrawalArchive WHERE lower(status) like "succe%" and  date(TIME) GROUP BY DATE(TIME) with rollup  LIMIT 0, 10000`);
    },
    getPayCode: async () => {
        return await client.query(`SELECT transactionId as Id, msisdn as Mobile, amount as Amount, DATE(TIME) DATE
        FROM PaycodeWithdrawalArchive
        WHERE date(TIME) and authorized=1 AND cancelled=0 AND reversed=0
        GROUP BY DATE(TIME)`);
    }
};