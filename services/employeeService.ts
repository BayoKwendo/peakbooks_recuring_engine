import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Employee from "../interfaces/Employee.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';


export default {
    doesExistById: async ({ id }: Employee) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM ${TABLE.EMPLOYEE} WHERE id = ? LIMIT 1`,
            [id],
        );
        return result.count > 0;
    },

    getCounts: async () => {
        const [result] = await client.query(
            `SELECT COUNT(*) customer FROM ${TABLE.EMPLOYEE}`);

        return result;
    },

    getCountsBalance: async () => {
        const [result] = await client.query(
            `SELECT sum(balance) balance FROM ${TABLE.EMPLOYEE}`);

        return result;
    },

    getAll: async ({ offset }: Employee) => {
        const query = await client.query(`SELECT count(*) over () total_page,otherNames, firstName, msisdn, email, balance, DATE(timeCreated) datecreated, registrationChannel 
          FROM ${TABLE.EMPLOYEE} ORDER BY id DESC LIMIT ?, 10`, [offset]);
        return query;
    },



    getAllBlackListed: async ({ offset }: Employee) => {
        const query = await client.query(`SELECT * ,count(*) over () total_page
        FROM Blacklist WHERE mobile ORDER BY date_modified DESC LIMIT ?, 10`, [offset]);
        return query;
    },
    getBlacklistCount: async () => {
        const [query] = await client.query(`SELECT COUNT(*) customer
        FROM Blacklist WHERE mobile`);
        return query;
    },

    getAllBlacKfILTER: async ({ filter_value }: Employee) => {
        const query = await client.query(`SELECT *
        FROM Blacklist WHERE mobile LIKE ? LIMIT 10`, [filter_value]);
        return query;
    },


    getFilter: async ({ filter_value }: Employee) => {
        return await client.query(`SELECT otherNames, firstName, msisdn, email, balance, DATE(timeCreated) datecreated, registrationChannel
         FROM ${TABLE.EMPLOYEE} WHERE msisdn = ? OR email = ? `, [filter_value, filter_value]);
    },
    getById: async ({ id }: Employee) => {
        return await client.query(
            `SELECT * FROM ${TABLE.EMPLOYEE} WHERE id = ?`,
            [id],
        );
    },

    add: async ({ mobile }: Employee,) => {
        return await client.query(`INSERT INTO Blacklist ( mobile ) values( ? )`, [mobile],);
    },

    updateById: async ({ id, email, msisdn }: Employee) => {
        const result = await client.query(
            `UPDATE ${TABLE.EMPLOYEE} SET name=?, department=?, isActive=? WHERE id=?`,
            [
                email,
                msisdn,
                id
            ],
        );
        return result.affectedRows;
    },

    deleteById: async ({ mobile }: Employee) => {
        const result = await client.query(
            `DELETE FROM Blacklist WHERE mobile = ?`, [mobile],
        );
        return result.affectedRows;
    },


    getOnceCustomerPresent: async ({ mobile }: Employee) => {
        const result = await client.query(
            `SELECT msisdn FROM CustomerAccount WHERE msisdn = ?`,
            [mobile],
        );
        return result.length;
    },

    getInboundMessages: async ({ mobile, offset }: Employee) => {
        const result = await client.query(
            `SELECT id,text,platform,processed,time,count(*) over () total_page
            FROM InboundMessages WHERE msisdn = ? LIMIT ?, 10`,
            [mobile, offset],
        );
        return result;
    },

    getOutboundMessages: async ({ mobile, offset }: Employee) => {
        const result = await client.query(
            `SELECT id, time,text,type 
             FROM OutboundMessages WHERE msisdn = ? order by id DESC LIMIT ?, 10`,
            [mobile, offset],
        );
        return result;
    },

    // doesExistById: async ({ id }: Employee) => {
    //     const [result] = await client.query(
    //         `SELE    CT COUNT(*) count FROM ${TABLE.EMPLOYEE} WHERE id = ? LIMIT 1`,
    //         [id],
    //     );
    //     return result.count > 0;
    // },

    getOutboundCount: async ({ mobile }: Employee) => {
        const [result] = await client.query(
            `SELECT count(id) as total_page
             FROM OutboundMessages WHERE msisdn = ?` ,
            [mobile],
        );
        return result;
    },

    getCustomerLog: async ({ mobile, offset }: Employee) => {
        const result = await client.query(
            `select cl.id, cl.narrative, cl.amount,count(*) over () total_page,  cl.balance+cl.bonus balance, cl.tickets, cl.ticketBundle, cl.ticketRate,  
            convert_tz(cl.time, '+00:00','-02:00') date
            from CustomerAccountLog cl inner join CustomerAccount c on c.id = cl.customerAccountId
               where  c.msisdn = ? 
            order by cl.id DESC LIMIT  ?, 10`,
            [mobile, offset],
        );
        return result;
    },

    getCustomerFilter: async ({ mobile, filter_value }: Employee) => {
        const result = await client.query(
            `select cl.id, cl.narrative, cl.amount, count(*) over () total_page, cl.balance+cl.bonus balance, cl.tickets, cl.ticketBundle, cl.ticketRate,  
            convert_tz(cl.time, '+00:00','-02:00') date
            from CustomerAccountLog cl inner join CustomerAccount c on c.id = cl.customerAccountId
            where c.msisdn = ? AND cl.id = ?
            order by cl.id DESC`,
            [mobile, filter_value],
        );
        return result;
    },

    getOnceCustomer: async ({ mobile }: Employee) => {
        const result = await client.query(
            `SELECT * FROM CustomerAccount WHERE msisdn = ?`,
            [mobile, mobile],
        );
        return result;
    },

    getGames: async ({ mobile, offset }: Employee) => {

        const result = await client.query(
            `SELECT ag.Amount AS Amount, ag.Channel AS Channel,count(*) over () total_page, ag.Type AS Type, ag.Sel AS Selection, ag.Dte AS Date FROM
              ( SELECT al.amount AS Amount, al.channel AS Channel, al.type AS Type, al.selection AS Sel, al.time AS Dte
                  FROM CustomerAccount c INNER JOIN BetLog al ON c.id = al.customerAccountId 
                  WHERE c.id = ?) AS ag LIMIT ?,10`,
            [mobile, offset]);
        return result;

    },

    getGamesFilter: async ({ mobile, filter_value }: Employee) => {
        const result = await client.query(
            `SELECT ag.Amount AS Amount, ag.Channel AS Channel,count(*) over () total_page, ag.Type AS Type, ag.Sel AS Selection, ag.Dte AS Date FROM
            ( SELECT al.amount AS Amount, al.channel AS Channel, al.type AS Type, al.selection AS Sel, al.time AS Dte
                FROM CustomerAccount c INNER JOIN BetLog al ON c.id = al.customerAccountId 
                WHERE c.id = ? or al.time LIKE ?) AS ag LIMIT 10`,
            [mobile, filter_value],
        );
        return result;
    },

    // getBound: async ({ mobile,offset }: Employee) => {
    //     const result = await client.query(
    //         `SELECT c.id in_id, c.msisdn msisdn, c.text in_text, c.time in_date, 
    //         d.inboundmessageId out_id, d.text out_text, d.time out_date, d.type type
    //         FROM InboundMessages c
    //         LEFT JOIN OutboundMessages d ON d.inboundmessageId=c.id
    //         WHERE c.msisdn = ? ORDER BY c.id DESC  LIMIT ?,10`,
    //         [mobile,offset],
    //     );
    //     return result;
    // },

    getBound: async ({ mobile, offset }: Employee) => {
        const result = await client.query(
            `select i.text in_text, convert_tz(i.time, '+00:00','-02:00') in_time, o.text response, o.sent, convert_tz(o.time, '+00:00','-02:00') out_time
            from InboundMessages i inner join OutboundMessages o on i.id = o.inboundMessageId
            where i.msisdn= ?
            order by convert_tz(i.time, '+00:00','-02:00') DESC LIMIT ?,10`,
            [mobile, offset],
        );
        return result;
    },


    getBoundCount: async ({ mobile }: Employee) => {
        const [result] = await client.query(
            `select count(*) as total_page
            from InboundMessages i inner join OutboundMessages o on i.id = o.inboundMessageId
            where i.msisdn= ?`,
            [mobile],
        );
        return result;
    },


    getBoundFilter: async ({ mobile, filter_value }: Employee) => {
        const result = await client.query(
            `SELECT c.id in_id, c.msisdn msisdn,count(*) over () total_page, c.text in_text, c.time in_date, 
            d.inboundmessageId out_id, d.text out_text, d.time out_date, d.type type
            FROM InboundMessages c
            LEFT JOIN OutboundMessages d ON d.inboundmessageId=c.id
            WHERE (c.msisdn = ? or c.email= ?) AND c.id = ? ORDER BY c.id DESC  LIMIT 10`,
            [mobile, mobile, filter_value],
        );
        return result;
    },
};