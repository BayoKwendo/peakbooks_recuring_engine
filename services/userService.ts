import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import User from "../interfaces/User.ts";

export default {
  createUser: async ({ approval, first_name, last_name, msisdn, client_id, industry, role_id, email, password,
    company_name,
    postal_address,
    first_time,
    our_client,
    paid,
    subscription,
    currency,
    currency_against_kenya,
    admin_role,
    inventory,
    username,
    bank,
    sales,
    purchase,
    investment,
    accountant,
    reports,
    url,
    documents }: User,) => {
    const result = await client.query(`INSERT INTO ${TABLE.USERS} SET
             approval = ?,
             first_name =?,
             username=?,
             last_name =?, msisdn=?, email =?, industry=?, company_name=?, postal_address =?, 
             role_id=?, password=?, first_time=?, our_client=?, paid=?,subscription=?, 
             currency=?,currency_against_kenya=?, 
             admin_role = ?, inventory = ?, bank =?, sales = ?, purchase =?, investment = ?, accountant = ?,reports = ?, documents = ?,url= ?,client_id = ?, status=1`, [
      approval,
      first_name,
      username,
      last_name,
      msisdn,
      email,
      industry,
      company_name,
      postal_address,
      role_id,
      password,
      first_time,
      our_client,
      paid,
      subscription,
      currency,
      currency_against_kenya,
      admin_role,
      inventory,
      bank,
      sales,
      purchase,
      investment,
      accountant,
      reports,
      documents,
      url,
      client_id
    ]);
    return result;
  },



  updateCLientUser: async ({ first_name, url, username, last_name, msisdn, client_id, industry, role_id, email,
    company_name,
    postal_address,
    first_time,
    subscription,
    currency,
    currency_against_kenya,
    admin_role,
    inventory,
    bank,
    approval,
    sales,
    purchase,
    investment,
    accountant,
    reports,
    documents, id }: User,) => {
    const result = await client.query(`UPDATE ${TABLE.USERS} SET
             approval =?,
             first_name =?,
             username=?,
             last_name =?, 
             msisdn=?,
             email =?, 
             industry=?, 
             company_name=?, 
             postal_address =?, 
             first_time=?, 
             subscription=?, 
             currency=?,
             currency_against_kenya=?, 
             admin_role = ?, 
             inventory = ?, 
             bank =?, 
             sales = ?, 
             purchase =?, 
             investment = ?, 
             accountant = ?,
             reports = ?, 
             documents = ?,
             url=?, 
             status=1 WHERE
             id = ?`, [
      approval,
      first_name,
      username,
      last_name,
      msisdn,
      email,
      industry,
      company_name,
      postal_address,
      first_time,
      subscription,
      currency,
      currency_against_kenya,
      admin_role,
      inventory,
      bank,
      sales,
      purchase,
      investment,
      accountant,
      reports,
      documents,
      url,
      id
    ]);
    return result;
  },


  loginUser: async ({ username }: User) => {
    const [result] = await client.query(
      `SELECT * FROM users WHERE username = ?`,
      [username],
    );
    return result;
  },

  getUsernames: async ({ email }: User) => {
    const result = await client.query(
      `SELECT username, company_name FROM users WHERE email = ?`,
      [email],
    );
    return result;
  },


  checkActive: async ({ username }: User) => {
    const [result] = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE username = ? AND status = 1`,
      [username],
    );
    return result;
  },

  userExist: async ({ email, client_id, admin_role }: User) => {
    const [result] = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE email = ? AND admin_role = 1`,
      [email, client_id, admin_role],
    );
    return result;
  },

  userClientID: async ({ email, client_id }: User) => {
    const [result] = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE email = ? AND client_id =?`,
      [email, client_id],
    );
    return result;
  },

  usernameExist: async ({ username }: User) => {
    const [result] = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE username = ? AND `,
      [username],
    );
    return result;
  },


  // get users who never renew their subscription after trial expiry
  getForgotUsers: async () => {

    const result = await client.query(`SELECT  DATEDIFF (DATE_FORMAT(subscription, '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d')) days, msisdn phone, company_name, first_name, email
    FROM  users WHERE role_id = 2 AND paid = 0 AND DATEDIFF (DATE_FORMAT(subscription, '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d')) < 0`)
    return result;

  },
  usermpesacode: async ({ client_id }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.MPESA_PAYMENT} WHERE userid = ? AND Status = 0 AND TransID <> "" LIMIT 1`,
      [client_id],
    );
    return result;
  },


  optsave: async ({ code, msisdn, expired }: User) => {
    const result = await client.query(
      `INSERT INTO  ${TABLE.VERIFICATION} SET msisdn=?, code=?, verified= 0, expired =?  `,
      [msisdn, code, expired],
    );
    return result;
  },


  getOTP: async ({ code, msisdn }: User) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.VERIFICATION} WHERE msisdn=? AND code=? AND status = 0`,
      [msisdn, code],
    );
    return result.count;
  },

  updateVerify: async ({ code, msisdn, client_id, login_expiry }: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.VERIFICATION} SET  verified = 1, client_id = ?, login_expiry = ? WHERE msisdn=? AND code=?`,
      [client_id, login_expiry, msisdn, code],
    );
    return result;
  },

  updateReminder: async ({ invoice_no, client_id}: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.INVOICES} SET  reminder = 1 WHERE invoice_no=? AND created_by=?`,
      [invoice_no, client_id],
    );
    return result;
  },
  //Audit trail
  getAudit: async ({ client_id }: User) => {
    const result = await client.query(
      `SELECT modified FROM  ${TABLE.VERIFICATION} WHERE verified = 1 AND status = 1 AND client_id = ? ORDER BY id DESC LIMIT 100 `, [client_id]);
    return result;
  },



  updateMPESA: async ({ mpesa_code, payment_status, amount_paid, client_id, subscription }: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.MPESA_PAYMENT} SET  
      payment_status = ?,
      subscription_date = ?, 
      userid = ?, 
      Status = 1
      WHERE TransID=? AND TransAmount = ? AND Status=0`,
      [payment_status, subscription, client_id, mpesa_code, amount_paid],
    );
    return result;
  },


  //get all sms
	getSMSLog: async ({ offset, page_size }: User) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.SMS_LOGS} WHERE id ORDER BY id DESC LIMIT ${offset},${page_size}`);
	},

	//get sms count

	getSMSCount: async () => {
		const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.SMS_LOGS}`);
		return result.count;
	},

	//filter sms details
	getSMSFilter: async ({ filter_value }: User) => {
		return await client.query(`SELECT * 
        FROM ${TABLE.SMS_LOGS} WHERE  origin =${filter_value} OR
        destination=${filter_value}`);
	},




  getClients: async ({ offset, status, page_size }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE role_id = 2 AND status = ? GROUP BY client_id ORDER BY id DESC LIMIT ?,? `, [status, offset, page_size]);
    return result;
  },

  getPageSizeCLient: async ({ offset, status }: User) => {
    const [result] = await client.query(
      `SELECT COUNT(client_id) count FROM  ${TABLE.USERS} WHERE role_id = 2 AND status = ? `, [status]);
    return result.count;
  },



  getClientFilter: async ({ filter_value }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE email LIKE ? or username LIKE ? or msisdn LIKE ? or client_id = ?`, [filter_value, filter_value, filter_value, filter_value]);
    return result;
  },

  updatePassword: async ({ password, username }: User,) => {
    const query = await client.query(`UPDATE ${TABLE.USERS} SET 
            account_status = 1,
            password = ? 
            WHERE username = ? `, [password, username]);
    return query;
  },


  activateAccount: async ({ id }: User,) => {
    const query = await client.query(`UPDATE ${TABLE.USERS} SET status = 1 WHERE client_id = ? `, [id]);
    return query;
  },

  activateAccountUser: async ({ id }: User,) => {
    const query = await client.query(`UPDATE ${TABLE.USERS} SET status = 1 WHERE id = ? `, [id]);
    return query;
  },

  activateAccountsize: async ({ id }: User,) => {
    const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.USERS} WHERE status = 0 AND client_id = ? `, [id]);
    return result.count;
  },

  deactiveAccountUser: async ({ id }: User,) => {
    const query = await client.query(`UPDATE  ${TABLE.USERS} SET status = 0 WHERE id = ? `, [id]);
    return query;
  },

  deactiveAccount: async ({ id }: User,) => {
    const query = await client.query(`UPDATE  ${TABLE.USERS} SET status = 0 WHERE client_id = ? `, [id]);
    return query;
  },

  // user delete account
  deleteAccount: async ({ id }: User,) => {
    const query = await client.query(`DELETE FROM  ${TABLE.USERS} WHERE id = ? AND admin_role != 1`, [id]);
    return query;
  },

  deactiveAccountsize: async ({ id }: User,) => {
    const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.USERS} WHERE status = 1 AND client_id = ? `, [id]);
    return result.count;
  },

  updateUser: async ({ password, email }: User,) => {
    const query = await client.query(`UPDATE  ${TABLE.USERS} SET password = ? WHERE email = ? `, [password, email]);
    return query;
  },

  //update organization profile
  updateUserCurrency: async ({ currency, company_name, postal_address, business_pin, financial_year, msisdn, id }: User,) => {
    const query = await client.query(`UPDATE  ${TABLE.USERS} SET currency = ?, company_name = ?, business_pin=?,
    financial_year = ?,msisdn=?, postal_address = ?
         WHERE id = ? `, [currency, company_name, business_pin, financial_year, msisdn, postal_address, id]);
    return query;
  },


  savePasswordResetCode: async ({ code, email, expired }: User) => {
    const result = await client.query(
      `INSERT INTO  ${TABLE.PASSWORD_RESET} SET email=?, code=?, verified= 0, expired =?  `,
      [email, code, expired]
    );
    return result;
  },

  updatePasswordReset: async ({ code, email }: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.PASSWORD_RESET} SET  verified = 1 WHERE email=? AND code=?`,
      [email, code]
    );
    return result;
  },

  resetUserPassword: async ({ password, username }: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.USERS} SET  password = ? WHERE username=?`,
      [password, username]
    );
    return result;
  },

  getResetOTP: async ({ code, email }: User) => {
    const [
      result,
    ] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.PASSWORD_RESET} WHERE email=? AND code=? AND status = 0`,
      [email, code]
    );
    return result.count;
  },


  getMpesaTransaction: async ({ offset }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.MPESA_PAYMENT} WHERE TransID <> "" ORDER BY id DESC LIMIT ?,100 `, [offset]);
    return result;
  },


  getPageSizeMpesa: async () => {
    const [result] = await client.query(
      `SELECT COUNT(id) count FROM  ${TABLE.MPESA_PAYMENT} WHERE TransID <> ""`);
    return result.count;
  },


  getMpesaTransactionFilter: async ({ filter_value }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.MPESA_PAYMENT} WHERE TransID LIKE ? `, [filter_value]);
    return result;
  },



  // get document
  getDocument: async ({ offset, startDate, endDate, id, page_size }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.DOCUMENTS} WHERE  
      client_id = ? AND date_created BETWEEN ${startDate} AND ${endDate} ORDER BY id DESC LIMIT ?,? `, [id, offset, page_size]);
    return result;
  },

  getPageSizeDocument: async ({ id, startDate, endDate }: User) => {
    const [result] = await client.query(
      `SELECT COUNT(id) count FROM  ${TABLE.DOCUMENTS} WHERE  
      client_id = ? AND date_created BETWEEN ${startDate} AND ${endDate}`, [id]);
    return result.count;
  },


  getDocumentFilter: async ({ filter_value, id }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.DOCUMENTS} WHERE document_name LIKE ? AND client_id = ?`, [filter_value, id]);
    return result;
  },



};
