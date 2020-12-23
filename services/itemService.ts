import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Item from "../interfaces/items.ts";

export default {
    createITEM: async ({ item_name, client_id }: Item) => {
        const result = await client.query(`INSERT INTO ${TABLE.ITEMS} SET
             item_name =?,
             client_id=?`, [
            item_name,
            client_id
        ]);
        return result;
    },

    getItems: async ({ offset, client_id, page_size }: Item) => {
        const result = await client.query(
            `SELECT * FROM ${TABLE.ITEMS} WHERE client_id = ? order by id DESC LIMIT ?,?`, [client_id, offset, page_size]);
        return result;
    },

    getItemFilter: async ({ filter_value, client_id }: Item) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ITEMS} WHERE item_name = ? AND client_id = ?`, [filter_value, client_id]);
        return result;
    },
    getPageSizeItem: async ({ client_id }: Item) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM ${TABLE.ITEMS} WHERE client_id = ? `, [client_id]);
        return result.count;
    },

    updateItem: async ({ id, item_name }: Item,) => {
        const query = await client.query(`UPDATE ${TABLE.ITEMS} SET 
        item_name = ? 
        WHERE id = ? `, [item_name, id]);
        return query;
    },

    deleteItem: async ({ id }: Item,) => {
        const query = await client.query(`DELETE FROM ${TABLE.ITEMS} 
        WHERE id = ? `, [id]);
        return query;
    },

};
