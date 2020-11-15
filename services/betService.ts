import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Bet from "../interfaces/Bets.ts";


export default {
    doesExistById: async ({ id }: Bet) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM ${TABLE.INCOME} WHERE id = ? LIMIT 1`,
            [id],
        );
        return result.count > 0;
    },

    getCounts: async () => {
        const [result] = await client.query(
            `SELECT COUNT(DATE) customer  
            FROM (
            SELECT DATE_FORMAT(time, '%Y-%m-%d') DATE,IF(type="LUCKY GAME","LUCKYGAME",IF(type="free","FREE",
            if(type="sure","SURE BET","JACKPOT")))BET_TYPE, FORMAT(COUNT(id),2) NoOfBets,SUM(amount) TOTALSTAKE, 
            SUM(IF(probability=1  and prediction=1, (reservation-amount),0)) PAYOUTS
            FROM BetLog 
            GROUP BY DATE(time),bet_type WITH ROLLUP
            ) AS tbl1
            WHERE DATE(DATE)`);
        return result;
    },
    getAll: async ({ offset }:Bet) => {
        const query = await client.query(`SELECT DATE,count(*) over () total_page, NOOFBETS,BET_TYPE, TOTALSTAKE, PAYOUTS 
        FROM (
        SELECT DATE_FORMAT(time, '%Y-%m-%d') DATE,IF(type="LUCKY GAME","LUCKYGAME",IF(type="free","FREE",
        if(type="sure","SURE BET","JACKPOT")))BET_TYPE, FORMAT(COUNT(id),2) NoOfBets,SUM(amount) TOTALSTAKE, 
        SUM(IF(probability=1  and prediction=1, (reservation-amount),0)) PAYOUTS
        FROM BetLog 
        GROUP BY DATE(time),bet_type WITH ROLLUP
        ) AS tbl1
        WHERE DATE(DATE) = CURDATE() ORDER BY DATE(DATE) DESC LIMIT ?, 10`, [offset]);
        return query;
    },




    getCountBetPerHour: async () => {
        const [result] = await client.query(
            `SELECT COUNT(time) customer FROM BetLog
             WHERE DATE(TIME)`);
        return result;
    },

    getJackPots: async ({ offset }:Bet) => {
        const result = await client.query(
            `SELECT DATE_FORMAT(TIME, '%Y-%m-%d') date,name,msisdn, count(*) over () total_page, format(amount,2) amount 
            FROM JackpotWinner 
            WHERE id>2 and date(time) = CURDATE() LIMIT ?, 10`, [offset]);
        return result;
    },
    
    getFilterJackPort: async ({ filter_value }: Bet) => {
        return await client.query(`SELECT DATE_FORMAT(TIME, '%Y-%m-%d') date,name,msisdn, count(*) over () total_page, format(amount,2) amount 
        FROM JackpotWinner 
        WHERE id>2 and date(time) LIKE ?`, [filter_value]);
    },

    otherWinners: async ({ offset }:Bet) => {
        const result = await client.query(  
            ` SELECT DATE_FORMAT(cl.time, '%Y-%m-%d') date,c.firstName  name , count(*) over () total_page, c.msisdn msisdn,cl.amount amount
            from CustomerAccountLog cl,CustomerAccount c WHERE LEFT(cl.narrative,3)="Won" AND cl.amount>=1000
            AND cl.amount<=4999
            AND c.id=cl.customerAccountId and date(cl.time) = CURDATE() 
            ORDER BY DATE(cl.time)  DESC LIMIT ? , 10`, [offset]);
        return result;
    },


    getFilterotherWinners: async ({ filter_value }:Bet) => {
        const result = await client.query(  
            ` SELECT DATE_FORMAT(cl.time, '%Y-%m-%d') date,c.firstName  name ,c.msisdn msisdn,cl.amount amount
            from CustomerAccountLog cl,CustomerAccount c WHERE LEFT(cl.narrative,3)="Won" AND cl.amount>=1000
            AND cl.amount<=4999
            AND c.id=cl.customerAccountId and date(cl.time) = ?
            ORDER BY DATE(cl.time) DESC`, [filter_value]);
        return result;
    },

   
    avarageBet: async ({ offset }:Bet) => {
        const result = await client.query(
            `SELECT  DATE_FORMAT(DATE(TIME), '%Y-%m-%d') DATE,count(*) over () total_page, format(COUNT(id),0) Total_Bets, format(COUNT(DISTINCT customerAccountId ),0) Customers,
            COUNT(id)/COUNT(DISTINCT customerAccountId ) Average_Bets 
            FROM BetLog
            WHERE date(TIME) 
            GROUP BY DATE(TIME) ORDER BY  DATE(TIME) DESC  LIMIT ? , 10`, [offset]);
        return result;
    },

    getfilteravarageBet: async ({filter_value}:Bet) => {
        const result = await client.query(
            `SELECT  DATE_FORMAT(DATE(TIME), '%Y-%m-%d') DATE,count(*) over () total_page, format(COUNT(id),0) Total_Bets, format(COUNT(DISTINCT customerAccountId ),0) Customers,
            COUNT(id)/COUNT(DISTINCT customerAccountId ) Average_Bets 
            FROM BetLog
            WHERE date(TIME) = ?
            GROUP BY DATE(TIME) ORDER BY  DATE(TIME)DESC`, [filter_value]);
        return result;
    },

    getBetPerHour: async ({ offset }:Bet) => {
        const query = await client.query(`SELECT DATE_FORMAT(time, '%Y-%m-%d') DATE,count(*) over () total_page, HOUR(TIME) as hours, COUNT(id) FROM BetLog  WHERE DATE(TIME) = CURDATE()  
         GROUP BY DATE(TIME), HOUR(TIME)  ORDER BY DATE(TIME) DESC  LIMIT ?, 10`, [offset]);
        return query;
    },



    
    getFilterBetPerHour: async ({ filter_value }: Bet) => {
        return await client.query(`SELECT DATE_FORMAT(time, '%Y-%m-%d') DATE, HOUR(TIME),
        COUNT(id) FROM BetLog WHERE DATE(TIME) = ?
        GROUP BY DATE(TIME) , HOUR(TIME)  ORDER BY DATE(TIME) DESC
          LIMIT 10`, [filter_value]);
    },

    getPayStack: async () => {
        const query = await client.query(`SELECT DATE(TIME)
        date, COUNT(id) count, SUM(amount) amount
        FROM DepositRequest 
        WHERE DATE(TIME) AND platform = "Paystack" AND LOWER(STATUS) LIKE "success%"
        GROUP BY DATE(TIME) ORDER BY DATE(TIME) DESC LIMIT 0, 1000`);
        return query;
    },
    getFilter: async ({ filter_value }: Bet) => {
        return await client.query(`SELECT DATE, NOOFBETS,BET_TYPE, TOTALSTAKE, PAYOUTS 
        FROM (
        SELECT DATE_FORMAT(time, '%Y-%m-%d') DATE,IF(type="LUCKY GAME","LUCKYGAME",IF(type="free","FREE",
        if(type="sure","SURE BET","JACKPOT")))BET_TYPE, FORMAT(COUNT(id),2) NoOfBets,SUM(amount) TOTALSTAKE, 
        SUM(IF(probability=1  and prediction=1, (reservation-amount),0)) PAYOUTS
        FROM BetLog 
        GROUP BY DATE(time),bet_type WITH ROLLUP
        ) AS tbl1
        WHERE DATE(DATE) = ? LIMIT 10`, [filter_value]);
    },
    getMTNDeposit: async () => {
        return await client.query(`select coalesce(p.Date, m.Date, w.Date) Date, ifnull(p.Count, 0) Paystack_Count, ifnull(p.Amount, 0) Paystack_Amount, ifnull(m.Count, 0) Mtn_Count, ifnull(m.Amount, 0) Mtn_Amount, ifnull(w.Count, 0) Withdrawal_Count, ifnull(w.Amount, 0) Withdrawal_Amount, ifnull(p.Count, 0) + ifnull(m.Count, 0) Total_Count, ifnull(p.Amount, 0) + ifnull(m.Amount, 0) Total_Amount, ifnull(p.Amount, 0) + ifnull(m.Amount, 0) - ifnull(w.Amount, 0) Net_Amount
        from(select date(convert_tz(time, '+00:00','-02:00')) Date, count(id) Count, sum(amount) Amount from DepositRequest where platform = 'Paystack' and lower(status) like 'success%' group by date(convert_tz(time, '+00:00','-02:00'))
        ) as pright join (select date(convert_tz(time, '+00:00','-02:00')) Date, count(id) Count, sum(amount) Amount from DepositRequest where platform = 'MTN Airtime' group by date(convert_tz(time, '+00:00','-02:00'))
        ) as m on p.Date=m.Date left join
        (select date(convert_tz(time, '+00:00','-02:00')) Date, count(id) Count, sum(amount) Amount from WithdrawalArchive where lower(status) like 'succe%' group by date(convert_tz(time, '+00:00','-02:00'))
        ) as won m.Date=w.Date order by Date LIMIT 0, 10000`);
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