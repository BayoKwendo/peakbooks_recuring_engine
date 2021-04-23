import client from "../db/client.ts";

import { TABLE } from "../db/config.ts";
import Accountant from "../interfaces/accountant.ts";

export default {


    createJournal: async ({ date, notes, amount, created_by }: Accountant) => {
        const result = await client.query(`INSERT INTO ${TABLE.JOURNALS}  SET
        date=?, 
        notes =?, 
        amount=?,
        created_by=?,
        status=1`, [
            date, notes, amount, created_by
        ]);
        return result;
    },


    //query journals
    getJournal: async ({ offset, client_id, page_size }: Accountant) => {
        const query = await client.query(`SELECT *
        FROM  ${TABLE.JOURNALS} WHERE created_by = ? order by id DESC LIMIT ?,?`, [client_id, offset, page_size]);
        return query;
    },

    getPageSizeJournal: async ({ client_id }: Accountant) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.JOURNALS} WHERE created_by = ?`, [client_id]);
        return result.count;
    },

    getJournalFilter: async ({ client_id, filter_value }: Accountant) => {
        const query = await client.query(`SELECT *
        FROM  ${TABLE.JOURNALS} WHERE created_by = ? AND journal_no = ?`, [client_id, filter_value]);
        return query;
    },

    //journal items get


    getJournalItems: async ({ filter_value }: Accountant) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.JOURNAL_ITEMS} WHERE journal_no = ?`, [filter_value]);
        return result;
    },

};