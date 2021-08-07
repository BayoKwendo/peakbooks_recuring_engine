import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Item from "../interfaces/items.ts";

export default {
    createITEM: async ({ item_name, rate, quantity, client_id }: Item) => {
        const result = await client.query(`INSERT INTO ${TABLE.ITEMS} SET
             item_name =?,
             quantity = ?,
             rate = ?,
             client_id=?`, [
            item_name,
            quantity,
            rate,
            client_id
        ]);
        return result;
    },


    createInvestment: async ({ investment_type, amount, client_id }: Item) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVESTMENT} SET
             investment_type =?,
             amount= ?,
             created_by= ?`, [
            investment_type,
            amount,
            client_id
        ]);
        return result;
    },


    getinvestment: async ({ offset, client_id, page_size }: Item) => {
        const result = await client.query(
            `SELECT * FROM ${TABLE.INVESTMENT} WHERE created_by = ? order by id DESC LIMIT ?,?`, [client_id, offset, page_size]);
        return result;
    },

    getPageSizeIvestment: async ({ client_id }: Item) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM ${TABLE.INVESTMENT} WHERE created_by = ? `, [client_id]);
        return result.count;
    },


    getItems: async ({ offset, client_id, page_size }: Item) => {
        const result = await client.query(
            `SELECT * FROM ${TABLE.ITEMS} WHERE client_id = ? order by modified DESC LIMIT ?,?`, [client_id, offset, page_size]);
        return result;
    },

    getItemFilter: async ({ filter_value, client_id }: Item) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ITEMS} WHERE item_name = "${filter_value}" AND client_id = ?`, [client_id]);
        return result;
    },


    
    getPageSizeItem: async ({ client_id }: Item) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM ${TABLE.ITEMS} WHERE client_id = ? `, [client_id]);
        return result.count;
    },

    updateItem: async ({ id, item_name, quantity, rate }: Item,) => {
        const query = await client.query(`UPDATE ${TABLE.ITEMS} SET 
        item_name = ?, quantity = ?, rate = ? 
        WHERE id = ? `, [item_name, quantity, rate, id]);
        return query;
    },

    deleteItem: async ({ id }: Item,) => {
        const query = await client.query(`DELETE FROM ${TABLE.ITEMS} 
        WHERE id = ? `, [id]);
        return query;
    },

    itemExist: async ({ item_name, client_id }: Item) => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.ITEMS} WHERE item_name = ? and client_id = ?`,
            [item_name, client_id],
        );
        return result;
    },

    //sales per item

    getItemSales: async ({ offset, created_by, page_size, startDate, endDate }: Item) => {
        const result = await client.query(
            `
            SELECT
             invoice_item,
             IFNULL((invoice_amount - credit_amount), 0) amount,
             IFNULL((invoice_quantity - credit_quantity), 0) quantity,

             IFNULL(CAST( (IFNULL((invoice_amount - credit_amount), 0)/IFNULL((invoice_quantity - credit_quantity), 0))  AS DECIMAL(10,2)), 0) avarage

             FROM ( 
             ( SELECT 
             p.name credit_item,
             IFNULL((CAST( CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2)) *
             CAST(sum(quantity) AS DECIMAL(10,2))  AS DECIMAL(10,2))),0) credit_amount,
             IFNULL((CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2))),0) credit_avarage,
             CAST(sum(quantity) AS DECIMAL(10,2)) credit_quantity
             from
             ${TABLE.CREDIT_ITEMS} p
             left join  ${TABLE.CREDIT_NOTE} n on n.credit_no = p.credit_no
             WHERE n.created_by = ${created_by} 
             AND p.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY p.name ) a

             left join

            (SELECT
             i.name invoice_item,
             IFNULL((CAST( CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2)) *
             CAST(sum(quantity) AS DECIMAL(10,2))  AS DECIMAL(10,2))),0) invoice_amount,

             IFNULL((CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2))),0) invoice_avarage,

             CAST(sum(quantity) AS DECIMAL(10,2)) invoice_quantity

             from
             
             ${TABLE.INVOICE_ITEMS} i
             left join  ${TABLE.INVOICES} n on n.invoice_no = i.invoice_no 
             WHERE n.created_by = ${created_by} AND n.estimate = '0' AND i.approved = 1 AND i.sales_order_no = 0
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY i.name ) b

             on  b.invoice_item = a.credit_item
            )

              LIMIT ${offset},${page_size}`);
        return result;
    },


    getItemSalesSize: async ({ created_by, startDate, endDate }: Item) => {
        const [result] = await client.query(
            `
            SELECT
             COUNT(invoice_item) count
            
             FROM ( 
             ( SELECT 
             p.name credit_item
             from
             ${TABLE.CREDIT_ITEMS} p
             left join  ${TABLE.CREDIT_NOTE} n on n.credit_no = p.credit_no
             WHERE n.created_by = ${created_by} 
             AND p.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY p.name ) a

             left join

            (SELECT
             i.name invoice_item
        
             from
             
             ${TABLE.INVOICE_ITEMS} i
             left join  ${TABLE.INVOICES} n on n.invoice_no = i.invoice_no 
             WHERE n.created_by = ${created_by} AND n.estimate = '0' AND i.approved = 1 AND i.sales_order_no = 0
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY i.name ) b
             on  b.invoice_item = a.credit_item
            )`);
        return result.count;
    },



    getItemPurchase: async ({ offset, created_by, page_size, startDate, endDate }: Item) => {
        const result = await client.query(
            `
            SELECT
             bill_item,
             IFNULL((bill_amount - credit_amount), 0) amount,
             IFNULL((bill_quantity - credit_quantity), 0) quantity,
             IFNULL(CAST( (IFNULL((bill_quantity - credit_amount), 0)/IFNULL((bill_quantity - credit_quantity), 0))  AS DECIMAL(10,2)), 0)  avarage

             FROM ( 
             ( SELECT 
             p.name credit_item,
             IFNULL((CAST( CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2)) *
             CAST(sum(quantity) AS DECIMAL(10,2))  AS DECIMAL(10,2))),0) credit_amount,
             IFNULL((CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2))),0) credit_avarage,
             CAST(sum(quantity) AS DECIMAL(10,2)) credit_quantity
             from
             ${TABLE.CREDIT_NOTE_ITEMS} p
             left join  ${TABLE.CREDIT_NOTE_VENDOR} n on n.credit_no = p.credit_no
             WHERE n.created_by = ${created_by} 
             AND p.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY p.name ) a

             left join

            (SELECT
             i.name bill_item,
             IFNULL((CAST( CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2)) *
             CAST(sum(quantity) AS DECIMAL(10,2))  AS DECIMAL(10,2))),0) bill_amount,

             IFNULL((CAST(CAST(sum(quantity * price) AS DECIMAL(10,2))/CAST(sum(quantity) AS DECIMAL(10,2)) AS DECIMAL(10,2))),0) bill_avarage,

             CAST(sum(quantity) AS DECIMAL(10,2)) bill_quantity

             from
             
             ${TABLE.BILL_ITEMS} i
             left join  ${TABLE.BILLS} n on n.bill_no = i.bill_no
             WHERE n.created_by = ${created_by} 
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY i.name ) b

             on  b.bill_item = a.credit_item
            )

              LIMIT ${offset},${page_size}`);
        return result;
    },


    getItemPurchaseSize: async ({ offset, created_by, page_size, startDate, endDate }: Item) => {
        const [result] = await client.query(
            `
            SELECT
              COUNT(bill_item) count
             FROM ( 
             ( SELECT 
             p.name credit_item
             from
             ${TABLE.CREDIT_NOTE_ITEMS} p
             left join  ${TABLE.CREDIT_NOTE_VENDOR} n on n.credit_no = p.credit_no
             WHERE n.created_by = ${created_by} 
             AND p.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY p.name ) a

             left join

            (SELECT
             i.name bill_item
             from
             
             ${TABLE.BILL_ITEMS} i
             left join  ${TABLE.BILLS} n on n.bill_no = i.bill_no
             WHERE n.created_by = ${created_by} 
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY i.name ) b

             on  b.bill_item = a.credit_item
            )`);
        return result.count;
    },



};
