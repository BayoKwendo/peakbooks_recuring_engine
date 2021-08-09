import client from '../db/client.ts';
import { TABLE } from '../db/config.ts';
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import Customers from '../interfaces/Customers.ts';

export default {
	createCustomer: async ({
		client_id,
		customer_type,
		title,
		first_name,
		other_name,
		tax_info,
		out_of_balance,
		balance_open,
		msisdn,
		email,
		company_name,
		customer_display_name,
		website,
	}: Customers) => {
		const result = await client.query(
			`INSERT INTO ${TABLE.CUSTOMER}  SET
             client_id=?, customer_type=?, title=?, first_name =?, other_name =?, msisdn=?, email =?, company_name=?,
              customer_display_name=?, 
              website=?,
              out_of_balance=?,
              balance_opening_balance=?,
              tax_info=?
              `,
			[
				client_id,
				customer_type,
				title,
				first_name,
				other_name,
				msisdn,
				email,
				company_name,
				customer_display_name,
				website,
				out_of_balance,
				balance_open,
				tax_info
			]
		);
		return result;
	},

	createAddress: async ({
		customer_id,
		street,
		city_town,
		state_province,
		country,
		tax_info,
		notes,
		payment_method,
		delivery_method,
		terms,
		out_of_balance,
	}: Customers) => {
		const result = await client.query(
			`INSERT INTO ${TABLE.CUSTOMER_MORE}
          SET
          customer_id=?, street=?, city_town=?, state_province=?, country=?, tax_info=?, 
          notes=?, payment_method=?, delivery_method=?, terms=?, out_of_balance=?`,
			[
				customer_id,
				street,
				city_town,
				state_province,
				country,
				tax_info,
				notes,
				payment_method,
				delivery_method,
				terms,
				out_of_balance,
			]
		);
		return result;
	},

	getAll: async ({ offset, client_id, page_size }: Customers) => {
		const query = await client.query(
			`SELECT * FROM ${TABLE.CUSTOMER} WHERE client_id = ? order by id DESC LIMIT ?,?`,
			[ client_id, offset, page_size ]
		);
		return query;
	},

	updateCustomerAll: async ({
		client_id,
		first_name,
		msisdn,
		email,
		company_name,
		customer_display_name,
		tax_info,
		out_of_balance,
		customer_id,
	}: Customers) => {
		const query = await client.query(
			`UPDATE ${TABLE.CUSTOMER} SET 
        client_id=?,  
        first_name =?, 
        msisdn=?, 
        email =?, 
        company_name=?, 
        customer_display_name=?,
        out_of_balance=?,
        tax_info=?
        WHERE id = ?
        `,
			[
				client_id,
				first_name,
				msisdn,
				email,
				company_name,
				customer_display_name,
				out_of_balance,
				tax_info,
				customer_id,
			]
		);
		return query;
	},

	updateOutofBalance: async ({ out_of_balance, customer_id }: Customers) => {
		const query = await client.query(
			`UPDATE ${TABLE.CUSTOMER} SET 
        out_of_balance=?
        WHERE id = ?`,
			[ out_of_balance, customer_id ]
		);
		return query;
	},

	insertOutofBalance: async ({ out_of_balance, filter_value, amount }: Customers) => {
		const query = await client.query(
			`INSERT INTO opening_balances_sales
      SET
       payment_received_id = ?,
       amount = ?,
       balance = ?`,
			[ filter_value, amount, out_of_balance ]
		);
		return query;
	},

	updatePaymentReceiveRecipt: async ({ out_of_balance, amount, filter_value }: Customers) => {
		const query = await client.query(
			`UPDATE payment_received 
       SET
        amount_received=?,
        paid_amount= ?,
        status=1
        WHERE id = ?`,
			[ out_of_balance, amount, filter_value ]
		);
		return query;
	},

	getCustomerMore: async ({ customer_id }: Customers) => {
		const query = await client.query(`SELECT * FROM ${TABLE.CUSTOMER_MORE} WHERE customer_id = ?`, [ customer_id ]);
		return query;
	},

	updateCustomerMore: async ({
		customer_id,
		street,
		city_town,
		state_province,
		country,
		street1,
		tax_info,
		notes,
		delivery_method,
		terms,
		out_of_balance,
	}: Customers) => {
		const query = await client.query(
			`UPDATE ${TABLE.CUSTOMER_MORE} SET 
          street=?, 
          city_town=?,
          state_province=?, 
          country=?,
          tax_info=?,
          notes=?,
          delivery_method=?, 
          terms=?, 
          out_of_balance=?
          WHERE customer_id=?`,
			[
				street,
				city_town,
				state_province,
				country,
				tax_info,
				notes,
				delivery_method,
				terms,
				out_of_balance,
				customer_id,
			]
		);
		return query;
	},

	getCustomerFilter: async ({ filter_value, client_id }: Customers) => {
		const result = await client.query(
			`SELECT * FROM  ${TABLE.CUSTOMER} WHERE company_name like "%${filter_value}%" AND client_id = ${client_id}`
		);
		return result;
	},

	getCustomerGetOne: async ({ filter_value }: Customers) => {
		const result = await client.query(`SELECT * FROM  ${TABLE.CUSTOMER} WHERE id = ?`, [ filter_value ]);
		return result;
	},

	getCustomerBalance: async ({ client_id, startDate, endDate }: Customers) => {
		const result = await client.query(
			`SELECT  IFNULL(SUM(IFNULL(out_of_balance, 0)), 0) out_of_balance FROM  ${TABLE.CUSTOMER} WHERE
             client_id = ${client_id} AND 
             created_at BETWEEN ${startDate} AND ${endDate}`
		);
		return result;
	},

	customerDelete: async ({ customer_id }: Customers) => {
		const query = await client.query(
			`DELETE FROM  ${TABLE.CUSTOMER}
        WHERE id = ?`,
			[ customer_id ]
		);
		return query;
	},

	getCustomerBalanceRatio: async ({ client_id, startDate, endDate }: Customers) => {
		const result = await client.query(
			`SELECT MONTH(b.created_at),b.created_at, 
      IFNULL(SUM(IFNULL(out_of_balance, 0)), 0) out_of_balance FROM
      ${TABLE.CUSTOMER} b LEFT JOIN ${TABLE.CUSTOMER_MORE} c ON b.id = c.customer_id WHERE
             b.client_id = ${client_id} AND  b.client_id >= date_sub(NOW(), INTERVAL 6 MONTH) AND
             b.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY MONTH(b.created_at) `
		);
		return result;
	},

	getPageSizeCustomer: async ({ client_id }: Customers) => {
		const [ result ] = await client.query(`SELECT COUNT(id) count FROM  ${TABLE.CUSTOMER} WHERE client_id = ?`, [
			client_id,
		]);
		return result.count;
	},
	updateCustomer: async ({ customer_id }: Customers) => {
		const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET status_more = 1 WHERE id = ? `, [ customer_id ]);
		return query;
	},
};
