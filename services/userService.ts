import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import User from "../interfaces/User.ts";

export default {
  createUser: async ({ first_name, last_name, msisdn, client_id, industry, role_id, email, password,
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
    bank,
    sales,
    purchase,
    investment,
    accountant,
    reports,
    url,
    documents }: User,) => {
    const result = await client.query(`INSERT INTO ${TABLE.USERS} SET
             first_name =?,
             last_name =?, msisdn=?, email =?, industry=?, company_name=?, postal_address =?, 
             role_id=?, password=?, first_time=?, our_client=?, paid=?,subscription=?, 
             currency=?,currency_against_kenya=?, 
             admin_role = ?, inventory = ?, bank =?, sales = ?, purchase =?, investment = ?, accountant = ?,reports = ?, documents = ?,url= ?,client_id = ?, status=1`, [
      first_name,
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



  updateCLientUser: async ({ first_name, url, last_name, msisdn, client_id, industry, role_id, email,
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
    documents }: User,) => {
    const result = await client.query(`UPDATE ${TABLE.USERS} SET
             first_name =?,
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
             email = ?`, [
      first_name,
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
      email
    ]);
    return result;
  },


  loginUser: async ({ email }: User) => {
    const [result] = await client.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );
    return result;
  },


  checkActive: async ({ email }: User) => {
    const [result] = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE email = ? AND status = 1`,
      [email],
    );
    return result;
  },

  userExist: async ({ email, msisdn }: User) => {
    const [result] = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE msisdn = ?`,
      [email, msisdn],
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

  getClients: async ({ offset, status }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE role_id = 2 AND status = ? GROUP BY client_id ORDER BY id DESC LIMIT ?,10 `, [status, offset]);
    return result;
  },

  getPageSizeCLient: async ({ offset, status }: User) => {
    const [result] = await client.query(
      `SELECT COUNT(id) count FROM  ${TABLE.USERS} WHERE role_id = 2 AND status = ? GROUP BY client_id`, [status]);
    return result.count;
  },



  getClientFilter: async ({ filter_value }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE email LIKE ? or msisdn LIKE ? or client_id = ?`, [filter_value, filter_value, filter_value]);
    return result;
  },

  updatePassword: async ({ password, email }: User,) => {
    const query = await client.query(`UPDATE ${TABLE.USERS} SET 
            account_status = 1,
            password = ? 
            WHERE email = ? `, [password, email]);
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

  deactiveAccountsize: async ({ id }: User,) => {
    const [result] = await client.query(`SELECT COUNT(id) count FROM ${TABLE.USERS} WHERE status = 1 AND client_id = ? `, [id]);
    return result.count;
  },

  updateUser: async ({ password, email }: User,) => {
    const query = await client.query(`UPDATE  ${TABLE.USERS} SET password = ? WHERE email = ? `, [password, email]);
    return query;
  },

  //update organization profile
  updateUserCurrency: async ({ currency, company_name, business_pin, financial_year, msisdn, id }: User,) => {
    const query = await client.query(`UPDATE  ${TABLE.USERS} SET currency = ?, company_name = ?, business_pin=?,financial_year = ?,msisdn=?
         WHERE id = ? `, [currency, company_name, business_pin, financial_year, msisdn, id]);
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

  resetUserPassword: async ({ email, password }: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.USERS} SET  password = ? WHERE email=?`,
      [password, email]
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





  getDocument: async ({ offset, id }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.DOCUMENTS} WHERE  client_id = ?  LIMIT ?,10 `, [id, offset]);
    return result;
  },

  getPageSizeDocument: async ({ id }: User) => {
    const [result] = await client.query(
      `SELECT COUNT(id) count FROM  ${TABLE.DOCUMENTS} WHERE  client_id = ? `, [id]);
    return result.count;
  },


  getDocumentFilter: async ({ filter_value, id }: User) => {
    const result = await client.query(
      `SELECT * FROM  ${TABLE.USERS} WHERE document_name LIKE ? AND client_id = ?`, [filter_value, id]);
    return result;
  },



};
