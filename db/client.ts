import { Client, ClientConfig } from "https://deno.land/x/mysql/mod.ts";
// config
import { DATABASE, MYSQL, TABLE } from "./config.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";



const config: ClientConfig = {
  hostname: MYSQL.host,
  username: MYSQL.user,
  password: MYSQL.password,
  db: MYSQL.database,
  port: MYSQL.port,
  debug: true
}
const client = await new Client().connect(config);


export default client;


// const run = async () => {
//   await client.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`);

//   await client.execute(`USE ${DATABASE}`);

//  /**  
//    * @todo Uncomment to create table if needed
//    */

//   // delete table if it exists before

//   // await client.execute(`DROP TABLE IF EXISTS ${TABLE.EMPLOYEE}`);

//   // create table

//   // await client.execute(`
//   //   CREATE TABLE ${TABLE.USERS} (
//   //       id int(11) NOT NULL AUTO_INCREMENT,
//   //       first_name varchar(100) NOT NULL,
//   //       last_name varchar(100) NOT NULL,
//   //       msisdn varchar(100) NOT NULL,
//   //       email varchar(100) NOT NULL,
//   //       industry varchar(100) NOT NULL,
//   //       role_id int(11) NOT NULL,
//   //       password varchar(100) NOT NULL,
//   //       PRIMARY KEY (id)
//   //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
//   // `);
  
// };



