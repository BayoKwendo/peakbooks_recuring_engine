import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Payment from "../interfaces/payments.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createPayment: async ({ name, client_id }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.PAYMENT_RECEIVED} SET
             name =?,
             created_by=?`, [
            name,
            client_id
        ]);
        return result;
    },



    createBankCash: async ({ account_name, account_balance, client_id }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.CASH_BANK} SET
             account_name =?,
             account_balance=?,
             created_by=?`, [
            account_name,
            account_balance,
            client_id
        ]);
        return result;
    },


    createBank: async ({ account_name, account_balance, account_type, account_code, currency, account_number, bank_name, description, client_id }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.BANK} SET
             account_name =?,
             account_balance=?,
             account_type =?,
             account_code =?,
             currency =?,
             account_number=?,
             bank_name =?,
             description =?,
             created_by=?`, [
            account_name,
            account_balance,
            account_type,
            account_code,
            currency,
            account_number,
            bank_name,
            description,
            client_id
        ]);
        return result;
    },

    getBanks: async ({ account_type, created_by }: Payment) => {
        const result = await client.query(
            `SELECT * FROM ${TABLE.BANK} WHERE account_type =? AND created_by =?`, [account_type, created_by]);
        return result;
    },


    getPayment: async ({ offset, page_size }: Payment) => {
        const result = await client.query(
            `SELECT name FROM ${TABLE.PAYMENT_RECEIVED} WHERE created_by order by id LIMIT ?,?`, [offset, page_size]);
        return result;
    },

    getPaymentFilter: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT name FROM  ${TABLE.ITEMS} WHERE name = ?`, [filter_value]);
        return result;
    },


    createDeposit_to: async ({ name, client_id }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.DEPOSIT_TO} SET
             name =?,
             created_by=?`, [
            name,
            client_id
        ]);
        return result;
    },

    getDeposit_to: async ({ offset, page_size }: Payment) => {
        const result = await client.query(
            `SELECT name FROM ${TABLE.DEPOSIT_TO} WHERE created_by order by id LIMIT ?,?`, [offset, page_size]);
        return result;
    },

    getDeposittoFilter: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT name FROM  ${TABLE.DEPOSIT_TO} WHERE name = ?`, [filter_value]);
        return result;
    },


    //Create Payment Received

    createPaymentReceived: async ({ customer_id, invoice_no, amount_received,
        payment_date, payment_mode, reference, notes, amount_inexcess, deposit_to }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.PAYMENT_RECEIVED_PAY}  SET
        customer_id=?,
        invoice_no=?,
        amount_received=?,
        payment_date =?,
        payment_mode =?,
        reference=?,
        notes=?,
        amount_inexcess=?,
        deposit_to=?`,
            [
                customer_id,
                invoice_no,
                amount_received,
                payment_date,
                payment_mode,
                reference,
                notes,
                amount_inexcess,
                deposit_to
            ]);
        return result;
    },

    //get payment recepp unprocessed

    getPaymentUnpaidrecord: async ({ customer_id }: Payment) => {
        const result = await client.query(
            `SELECT id FROM  ${TABLE.PAYMENT_RECEIVED_PAY} WHERE status = 0 and customer_id = ?`, [customer_id]);
        return result;
    },

    getPaymentUnpaidrecordbill: async ({ vendor_id }: Payment) => {
        const result = await client.query(
            `SELECT id FROM  ${TABLE.PAYMENT_RECEIVED_PAY_BILL} WHERE status = 0 and vendor_id = ?`, [vendor_id]);
        return result;
    },

    updatePaymentBillUnpaidrecord: async ({ vendor_id }: Payment) => {
        const query = await client.query(`UPDATE ${TABLE.PAYMENT_RECEIVED_PAY_BILL} SET 
        status = 1 
        WHERE status = 0 and vendor_id = ?`, [vendor_id]);
        return query;
    },


    updatePaymentUnpaidrecord: async ({ customer_id }: Payment) => {
        const query = await client.query(`UPDATE ${TABLE.PAYMENT_RECEIVED_PAY} SET 
        status = 1 
        WHERE status = 0 and customer_id = ?`, [customer_id]);
        return query;
    },




    // return payments made

    getPaymentReceivedUnpaid: async ({ offset, created_by, page_size }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, i.id, c.customer_display_name, i.invoice_no,i.payment_mode,i.amount_inexcess,i.amount_received FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ? AND i.status = 1 order by i.id DESC LIMIT ?,?`, [created_by, offset, page_size]);
        return result;
    },
    getReceivedFilter: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, c.customer_display_name, i.invoice_no,i.payment_mode,i.amount_inexcess,i.amount_received FROM 
       ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.invoice_no = ?`, [filter_value]);
        return result;
    },

    getPageSizePaymentReceived: async ({ created_by }: Payment) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count  FROM 
            ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
             c.client_id = ? AND i.status = 1 `, [created_by]);
        return result.count;
    },

    createBill: async ({ vendor_id, terms, due_amount, due_date, bill_date, tax_inclusive, notes, sub_total, amount,
        tax_amount, discount_amount, recurring, created_by, estimate }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.BILLS}  SET
        vendor_id=?,terms=?, due_date =?, bill_date =?, notes=?,sub_total=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        tax_inclusive=?,
        recurring=?,
        created_by=?`, [
            vendor_id,
            terms,
            due_date,
            bill_date,
            notes,
            sub_total,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            tax_inclusive,
            recurring,
            created_by
        ]);
        return result;
    },
    createRecurringBill: async ({ bill_no, due_amount, start_time, end_time, vendor_id, frequecy, created_by, frequency_type }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.RECURRING_BILLS}  SET
        bill_no=?,
        due_amount=?,
        start_time=?, 
        end_time =?, 
        vendor_id =?,
        frequecy =?,
        frequency_type=?,
        created_by=?,
        last_updated = '1',
        status ='1'`, [
            bill_no,
            due_amount,
            start_time,
            end_time,
            vendor_id,
            frequecy,
            frequency_type,
            created_by
        ]);
        return result;
    },
    getPageSizeBill: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.BILLS} i inner join ${TABLE.VENDORS}
             c on c.id = i.vendor_id WHERE created_by = ?`, [created_by]);
        return result.count;
    },


    getBill: async ({ offset, created_by, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT 
            i.bill_no, 
            i.order_no, 
            i.terms, 
            i.due_date,
            i.due_amount,
            i.status, 
            i.bill_date, 
            i.date_modified, 
            i.discount_amount, 
            i.sub_total, 
            i.tax_amount, 
            i.notes,
            i.amount, 
            c.vendor_display_name,
            c.email, 
            c.company_name  FROM 
            ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
            WHERE i.created_by = ? order by i.date_modified DESC LIMIT ?,?`, [created_by, offset, page_size]);
        return result;
    },


    //aging summary

    getAgingSummaryBills: async ({ offset, created_by, page_size, estimate, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT c.vendor_display_name, 
            
             sum(CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) total_amount,

             sum( if ( DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) = 0,
             CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)),0)) as current_amount,

             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 16  
             AND
             DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 0),
             CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_15,

             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 31  
             AND
             DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 15),
             CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_15_30,

             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 46  
             AND
             DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 30),
             CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_30_45,


             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 45 ),
             CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_45

             FROM 
            ${TABLE.BILLS} i
            inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
            WHERE i.created_by = ${created_by} AND i.status = "0"
            AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name 
            order by i.date_modified DESC LIMIT ${offset},${page_size}`);
        return result;
    },


    getAgingSummarySizeVendor: async ({ created_by, startDate, endDate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(DISTINCT c.id) count
            FROM 
            ${TABLE.VENDORS} c 
            left join ${TABLE.BILLS} i on c.id = i.vendor_id 
            left join ${TABLE.CREDIT_NOTE_VENDOR} n on n.vendor_id = c.id
            WHERE i.created_by = ${created_by} AND i.status = "0" AND i.created_at BETWEEN ${startDate} AND ${endDate} `);
        return result.count;
    },


    getBillItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.BILL_ITEMS} WHERE bill_no = ?`, [filter_value]);
        return result;
    },

    getInvoiceFilter: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE i.created_by = ? AND i.bill-no = ?`, [created_by, filter_value]);
        return result;
    },
    getFrequencyBills: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.bill_no, i.start_time, i.end_time,i.due_amount, i.modified, i.status, i.frequecy, 
            i.frequency_type, c.vendor_display_name,c.email, c.company_name  FROM 
            ${TABLE.RECURRING_BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
            WHERE i.created_by = ? order by i.modified DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getPageSizeFrequencyBills: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.RECURRING_BILLS} i inner join ${TABLE.VENDORS}
             c on c.id = i.vendor_id WHERE created_by = ?`, [created_by]);
        return result.count;
    },
    getFrequencyBillsFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.RECURRING_BILLS} i inner join ${TABLE.CUSTOMER} c on c.id = i.vendor_id WHERE i.bill_no = ?`, [filter_value]);
        return result;
    },

    getFilterBillsUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
            i.vendor_id = ? AND i.status=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result;
    },
    getBillingsAmount: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT 
             IFNULL(sum(CAST(SUBSTRING(replace(amount, ',', ''),5) AS DECIMAL(10,2))), 0) amount
             
             FROM  ${TABLE.BILLS}
              WHERE
             created_by = ${created_by} AND 
             created_at BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },

    getPaymentReceivable: async ({ startDate, endDate, created_by }: Payment) => {
        const result = await client.query(
            `SELECT IFNULL(SUM(i.amount_received), 0) amount_received FROM
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ${created_by} AND i.created BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },


    // payment received report
    getPaymentReceivedReports: async ({ startDate, endDate, page_size, offset, created_by }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference,i.notes, i.id, c.customer_display_name, i.invoice_no,i.payment_mode,
            CAST(i.amount_inexcess AS DECIMAL(10,2)) amount_inexcess,
           i.amount_received FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ${created_by} AND i.status = 1 AND i.created BETWEEN ${startDate} AND ${endDate} order by i.id DESC LIMIT ${offset},${page_size}`);
        return result;
    },

    getPaymentReceivedReportsSize: async ({ created_by, startDate, endDate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ${created_by} AND i.status = 1 AND i.created BETWEEN ${startDate} AND ${endDate}`);
        return result.count;
    },

    getPaymentPettyCash: async ({ startDate, endDate, created_by }: Payment) => {
        const result = await client.query(
            `SELECT IFNULL(SUM(i.amount_received), 0) amount_received FROM
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ${created_by} AND i.deposit_to = "Petty Cash" AND i.created BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },





    getPaymentUndeposited: async ({ startDate, endDate, created_by }: Payment) => {
        const result = await client.query(
            `SELECT IFNULL(SUM(i.amount_received), 0) amount_received  FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
         c.client_id = ${created_by} AND i.deposit_to = "Undeposited Funds" AND i.created BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },

    getBillFilterPaidReceipt: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
             ${TABLE.BILLS} WHERE
           payment_received_id = ?`, [filter_value]);
        return result;
    },

    getPageSizeBillPaidReceipt: async ({ filter_value }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM 
            ${TABLE.INVOICES} WHERE
          payment_received_id = ? `, [filter_value]);
        return result.count;
    },
    getPageSizeBillUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM 
            ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
             i.vendor_id = ? AND i.status=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result.count;
    },


    createPaymentReceivedBill: async ({ vendor_id, bill_no, amount_received,
        payment_date, payment_mode, reference, order_no, notes, amount_inexcess, deposit_to }: Payment) => {
        const result = await client.query(`INSERT INTO ${TABLE.PAYMENT_RECEIVED_PAY_BILL}  SET
        vendor_id=?,
        bill_no=?,
        order_no=?,
        amount_received=?,
        payment_date =?,
        payment_mode =?,
        reference=?,
        notes=?,
        amount_inexcess=?,
        deposit_to=?`,
            [
                vendor_id,
                bill_no,
                order_no,
                amount_received,
                payment_date,
                payment_mode,
                reference,
                notes,
                amount_inexcess,
                deposit_to
            ]);
        return result;
    },


    //return paid payment for bils
    getPaymentReceivedpaidbills: async ({ offset, created_by }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, i.id, c.vendor_display_name, i.bill_no, i.payment_mode, i.amount_inexcess, i.amount_received FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
         c.client_id = ? AND i.status = 1 order by i.id DESC LIMIT ?,10`, [created_by, offset]);
        return result;
    },
    getReceivedFilterBills: async ({ filter_value }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference, c.vendor_display_name, i.bill_no, i.payment_mode,i.amount_inexcess,i.amount_received FROM 
         ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE i.bill_no = ?`, [filter_value]);
        return result
    },
    getPageSizePaymentReceivedBills: async ({ created_by }: Payment) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count  FROM 
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
             WHERE
             c.client_id = ? AND i.status = 1`, [created_by]);
        return result.count;
    },

    //payment made report

    getPaymentMadeReports: async ({ startDate, endDate, page_size, offset, created_by }: Payment) => {
        const result = await client.query(
            `SELECT i.created, i.reference,i.notes, i.id, c.vendor_display_name,
            CAST(SUBSTRING(replace(i.amount_inexcess, ',', ''),5) AS DECIMAL(10,2)) amount_excess,
            i.bill_no, i.deposit_to, i.payment_mode,
            i.amount_inexcess,
            i.amount_received 
            
            FROM
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
             c.client_id = ${created_by} AND i.status = 1 AND i.created BETWEEN ${startDate} AND ${endDate} order by i.id DESC LIMIT ${offset},${page_size}`);
        return result;
    },


    getPaymentMadeReportAmount: async ({ startDate, endDate, created_by }: Payment) => {
        const result = await client.query(
            `SELECT 
              IFNULL(SUM(i.amount_received), 0) amount 
            FROM
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
             c.client_id = ${created_by} AND i.status = 1 AND i.created BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },

    getPaymentMadeReportsSize: async ({ created_by, startDate, endDate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM 
        ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id WHERE
         c.client_id = ${created_by} AND i.status = 1 AND i.created BETWEEN ${startDate} AND ${endDate}`);
        return result.count;
    },

    //recurring bills ustatus update
    updatefrequencystatus: async ({ bill_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_BILLS} SET
            status = 0
            WHERE bill_no = ?`,
            [bill_no]);
        return result;
    },


    updatefrequencystatus2: async ({ bill_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_BILLS} SET
            status = 1
            WHERE bill_no = ?`,
            [bill_no]);
        return result;
    },


    //banking report

    getBanking: async ({ startDate, endDate, created_by }: Payment) => {
        const result = await client.query(
        `SELECT f.total, f.peak_amount , f.account_balance, f.account_type
          FROM
          
      (
         (   
           SELECT  
           IFNULL(SUM(t.amount_received), 0) total,
           t.amount_received2 - (IFNULL(SUM(t.amount_received), 0) - t.amount_received2) peak_amount, t.account_balance, t.account_type
           FROM
          (
           ( 
            SELECT 
            IFNULL(SUM(i.amount_received), 0) amount_received,
            IFNULL(SUM(i.amount_received), 0) amount_received2,
            IFNULL((b.account_balance), 0) account_balance,            
            IFNULL((i.deposit_to), "Banks") account_type
            FROM ${TABLE.PAYMENT_RECEIVED_PAY} i 
            inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id
            inner join ${TABLE.BANK} b on c.client_id = b.created_by
            WHERE
            c.client_id = ${created_by} AND i.deposit_to in (b.account_name) AND
             b.account_name in (b.account_name) AND i.created BETWEEN ${startDate} AND ${endDate} GROUP BY i.deposit_to
            )
         
            UNION ALL
           (
             SELECT IFNULL(SUM(i.amount_received), 0) amount_received,
             IFNULL(NULL, 0) amount_received2,
             IFNULL((b.account_balance), 0) account_balance, 
             IFNULL((i.deposit_to), "Banks") account_type  
             
             FROM
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i 
             left join ${TABLE.VENDORS} c on c.id = i.vendor_id 
             left join ${TABLE.BANK} b on c.client_id = b.created_by
             WHERE 
             c.client_id = ${created_by} AND i.deposit_to in (b.account_name)
             AND b.account_name in (b.account_name)
             AND i.created BETWEEN ${startDate} AND ${endDate} GROUP BY i.deposit_to
            ) 
            
            UNION ALL

           ( SELECT 
            IFNULL(SUM(c.amount), 0) amount_received, 
            IFNULL((b.account_balance), 0) account_balance,
            IFNULL(NULL, 0) amount_received2,
            IFNULL((c.paid_through), "Banks") account_type FROM ${TABLE.EXPENSES} c
            left join ${TABLE.BANK} b on c.client_id = b.created_by
            WHERE
              c.paid_through in (b.account_name) AND c.client_id= ${created_by} AND
              b.account_name in (b.account_name) AND c.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.paid_through 
          )
          ) AS t
          GROUP BY t.account_type

        )

          UNION ALL

           (
               SELECT IFNULL(SUM(g.amount_received), 0) total,
            g.amount_received2 - (IFNULL(SUM(g.amount_received), 0) - g.amount_received2) peak_amount, g.account_balance, g.account_type
             FROM
           (
           (
            SELECT
            IFNULL(SUM(i.amount_received), 0) amount_received,

            IFNULL(SUM(i.amount_received), 0) amount_received2,

            IFNULL((b.account_balance), 0) account_balance, IFNULL((i.deposit_to), "Petty Cash") account_type
            FROM ${TABLE.PAYMENT_RECEIVED_PAY} i 
            left join ${TABLE.CUSTOMER} c on c.id = i.customer_id
            left join ${TABLE.CASH_BANK} b on c.client_id = b.created_by
            WHERE
            c.client_id = ${created_by} AND i.deposit_to = "Petty Cash" AND
             b.account_name = "Petty Cash" AND i.created BETWEEN ${startDate} AND ${endDate}
            )
               UNION ALL
           ( 
             SELECT IFNULL(SUM(i.amount_received), 0) amount_received,
             IFNULL(NULL, 0) amount_received2,

             IFNULL((b.account_balance), 0) account_balance, IFNULL((i.deposit_to), "Petty Cash") account_type  FROM
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i 
             left join ${TABLE.VENDORS} c on c.id = i.vendor_id 
             left join ${TABLE.CASH_BANK} b on c.client_id = b.created_by
             WHERE
             c.client_id = ${created_by} AND i.deposit_to = "Petty Cash" AND  b.account_name = "Petty Cash"
             AND b.account_name= "Petty Cash" AND i.created BETWEEN ${startDate} AND ${endDate} )

             UNION ALL

           ( SELECT IFNULL(SUM(c.amount), 0) amount_received, IFNULL((b.account_balance), 0) account_balance,
                       IFNULL(NULL, 0) amount_received2,

            IFNULL((c.paid_through), "Petty Cash") account_type FROM ${TABLE.EXPENSES} c
              left join ${TABLE.CASH_BANK} b on c.client_id = b.created_by
              WHERE
              c.paid_through = "Petty Cash" AND c.client_id= ${created_by} AND
              b.account_name = "Petty Cash" AND c.created_at BETWEEN ${startDate} AND ${endDate}
           )
          ) AS g
          )
          UNION ALL

          (
              SELECT IFNULL(SUM(r.amount_received), 0) total,
               r.amount_received2 - (IFNULL(SUM(r.amount_received), 0) - r.amount_received2) peak_amount, r.account_balance, r.account_type
             FROM
          (
           (
            SELECT
            IFNULL(SUM(i.amount_received), 0) amount_received,

            IFNULL(SUM(i.amount_received), 0) amount_received2,

            IFNULL((b.account_balance), 0) account_balance, IFNULL((i.deposit_to), "Undeposited Funds") account_type
            FROM ${TABLE.PAYMENT_RECEIVED_PAY} i 
            left join ${TABLE.CUSTOMER} c on c.id = i.customer_id
            left join ${TABLE.CASH_BANK} b on c.client_id = b.created_by
            WHERE
            c.client_id = ${created_by} AND i.deposit_to = "Undeposited Funds" AND
             b.account_name = "Undeposited Funds" AND i.created BETWEEN ${startDate} AND ${endDate}
            )
               UNION ALL
           ( 
             SELECT IFNULL(SUM(i.amount_received), 0) amount_received,
             IFNULL(NULL, 0) amount_received2,

             IFNULL((b.account_balance), 0) account_balance, IFNULL((i.deposit_to), "Undeposited Funds") account_type  FROM
             ${TABLE.PAYMENT_RECEIVED_PAY_BILL} i 
             left join ${TABLE.VENDORS} c on c.id = i.vendor_id 
             left join ${TABLE.CASH_BANK} b on c.client_id = b.created_by
             WHERE
             c.client_id = ${created_by} AND i.deposit_to = "Undeposited Funds" AND  b.account_name = "Undeposited Funds"
             AND b.account_name= "Undeposited Funds" AND i.created BETWEEN ${startDate} AND ${endDate} )

             UNION ALL

           ( SELECT IFNULL(SUM(c.amount), 0) amount_received, IFNULL((b.account_balance), 0) account_balance,
                       IFNULL(NULL, 0) amount_received2,

            IFNULL((c.paid_through), "Undeposited Funds") account_type FROM ${TABLE.EXPENSES} c
              left join ${TABLE.CASH_BANK} b on c.client_id = b.created_by
              WHERE
              c.paid_through = "Undeposited Funds" AND c.client_id= ${created_by} AND 
              b.account_name = "Undeposited Funds" AND c.created_at BETWEEN ${startDate} AND ${endDate}
           )

          ) AS r
          )
        ) AS f
        `);




        return result;
    },
};
