import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createInvoice: async ({ customer_id, invoice_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, recurring, created_by, estimate, tax_exclusive }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVOICES}  SET
        customer_id=?,terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        recurring=?,
        created_by=?,
        estimate=?,
        tax_exclusive=?`, [
            customer_id,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            sub_total,
            statement_invoice,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            recurring,
            created_by,
            estimate,
            tax_exclusive
        ]);
        return result;
    },

    createRecurringInvoice: async ({ invoice_no, due_amount, start_time, end_time, customer_id, frequecy, created_by, frequency_type }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.RECURRING_INVOICE}  SET
        invoice_no=?,
        due_amount=?,
        start_time=?, 
        end_time =?, 
        customer_id =?,
        frequecy =?,
        frequency_type=?,
        created_by=?,
        last_updated = '1',
        status ='1'`, [
            invoice_no,
            due_amount,
            start_time,
            end_time,
            customer_id,
            frequecy,
            frequency_type,
            created_by
        ]);
        return result;
    },
    updateInvoice: async ({ customer_id, invoice_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, created_by, tax_exclusive }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} 
        SET
        customer_id=?, invoice_no=?, terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive=?
        WHERE invoice_no = ?`, [
            customer_id,
            invoice_no,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            sub_total,
            statement_invoice,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by,
            tax_exclusive,
            invoice_no]);
        return query;
    },

    convertEstimate: async ({ invoice_no }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} SET 
        estimate = 0
        WHERE invoice_no = ? `, [invoice_no]);
        return query;
    },


    getInvoices: async ({ offset, startDate, endDate, created_by, estimate, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no,i.tax_exclusive, i.terms,
            CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount_invoice,
           
            DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) period,
           
            i.due_date, i.status, i.invoice_date, i.date_modified, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
           
            i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            
            WHERE i.created_by = ${created_by} AND i.estimate = ${estimate} 
              AND i.created_at BETWEEN ${startDate} AND ${endDate}
            order by i.date_modified DESC LIMIT ${offset},${page_size}`);
        return result;
    },

    //receivable summary
    getReceivableSummary: async ({ offset, startDate, endDate, created_by, estimate, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT t.transaction,t.transaction_type,t.amount, t.customer_name, t.date_created, t.balance, t.status
             FROM (
            ( SELECT i.invoice_no transaction, 
              CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount,

              if(i.invoice_no, "Invoice", "Invoice") transaction_type,

              if(i.status = "1", 0, CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) balance,

              if(i.status = "1", "Sent", "Overdue") status,

              i.created_at date_created, c.customer_display_name customer_name  FROM
             ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
              WHERE i.created_by = ${created_by} AND i.estimate = ${estimate} 
              AND i.created_at BETWEEN ${startDate} AND ${endDate} ) 
              UNION ALL

            (   SELECT i.credit_no transaction, 
                CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount,

                if(i.credit_no, "Credit Note", "Credit Note") transaction_type,

                if(i.status = "0", 0, CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) balance,

                if(i.status = "1", "Open", "Closed") status,

                i.created_at date_created, c.customer_display_name customer_name  FROM
             ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
             WHERE i.created_by = ${created_by} 
             AND i.created_at BETWEEN ${startDate} AND ${endDate}) 
            ) as t
             order by t.date_created DESC
             LIMIT ${offset},${page_size}
            `

        );
        return result;
    },


    getReceivableSummarySize: async ({ offset, startDate, endDate, created_by, estimate, page_size }: Invoices) => {
        const [result] = await client.query(

            `SELECT sum(t.counts) count
             FROM (
            ( SELECT COUNT(i.invoice_no) counts
               FROM
             ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
              WHERE i.created_by = ${created_by} AND i.estimate = ${estimate} 
              AND i.created_at BETWEEN ${startDate} AND ${endDate} ) 
              UNION ALL

            (   SELECT COUNT(i.credit_no) counts
                 FROM
             ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
             WHERE i.created_by = ${created_by} 
             AND i.created_at BETWEEN ${startDate} AND ${endDate}) 
            ) as t 
            `
        );
        return result.count;
    },


    //Customer balance report query
    getCustomerBalanceInvoice: async ({ offset, created_by, page_size, estimate, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT customer_display_name,count, 
            IFNULL(invoice_amount, 0) invoice_amount, 
             IFNULL(credit_amount, 0) credit_amount, (IFNULL(invoice_amount, 0) - IFNULL(credit_amount, 0)) balance  
             FROM (

             (SELECT  c.customer_display_name, 
             COUNt(i.id) count,
             i.customer_id,
             sum( CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) invoice_amount 
             from
             ${TABLE.CUSTOMER} c 
             left join  ${TABLE.INVOICES} i on c.id = i.customer_id 
             WHERE i.created_by = ${created_by} AND i.status = "0" AND i.estimate = '0' 
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.customer_display_name) a

             left join

             ( SELECT  d.customer_display_name customer,
                         COUNt(n.id) counts,
                                      n.customer_id,
             sum( CAST(SUBSTRING(replace(n.due_amount, ',', ''),5) AS DECIMAL(10,2))) credit_amount
             from
             ${TABLE.CUSTOMER} d 
             left join  ${TABLE.CREDIT_NOTE} n on n.customer_id = d.id 
             WHERE n.created_by = ${created_by} AND n.status = "1"
             AND n.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY d.customer_display_name) b
             
             on a.customer_id = b.customer_id
             ) 
              LIMIT ${offset},${page_size}`);
        return result;
    },




    getCustomerBalanceInvoiceSize: async ({ created_by, startDate, endDate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(DISTINCT c.id) count
            FROM 
            ${TABLE.CUSTOMER} c 
            left join ${TABLE.INVOICES} i on c.id = i.customer_id 
            left join ${TABLE.CREDIT_NOTE} n on n.customer_id = c.id 
            WHERE (i.created_by = ${created_by} OR n.created_by = ${created_by}) AND (i.status = "0" OR n.status = "1") AND i.estimate = '0' AND
             (i.created_at BETWEEN ${startDate} AND ${endDate} OR 
             n.created_at BETWEEN ${startDate} AND ${endDate})
             `);
        return result.count;
    },


    //customer sales report

    getCustomerSales: async ({ offset, created_by, page_size, estimate, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT 
            customer_display_name, count invoice_counts, 
            (IFNULL(invoice_amount, 0) - IFNULL(credit_amount, 0)) sales_with_tax, 
            IFNULL(invoice_amount, 0)-(IFNULL(credit_tax, 0)+IFNULL(invoice_tax, 0)+IFNULL(credit_amount, 0)) sales
            
             FROM (

             (SELECT  c.customer_display_name, 
             COUNt(i.id) count,
             i.customer_id,
             sum( CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) invoice_amount, 
             sum( CAST(SUBSTRING(replace(i.tax_amount, ',', ''),5) AS DECIMAL(10,2))) invoice_tax 
             from
             ${TABLE.CUSTOMER} c 
             left join  ${TABLE.INVOICES} i on c.id = i.customer_id 
             WHERE i.created_by = ${created_by} AND i.status = "0" AND i.estimate = '0' 
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.customer_display_name) a

             left join

             ( SELECT  
             d.customer_display_name customer,
             COUNt(n.id) counts,
              n.customer_id,
             sum( CAST(SUBSTRING(replace(n.tax_amount, ',', ''),5) AS DECIMAL(10,2))) credit_tax, 
             sum( CAST(SUBSTRING(replace(n.amount, ',', ''),5) AS DECIMAL(10,2))) credit_amount
             from
             ${TABLE.CUSTOMER} d 
             left join  ${TABLE.CREDIT_NOTE} n on n.customer_id = d.id 
             WHERE n.created_by = ${created_by} 
             AND n.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY d.customer_display_name) b
             
             on a.customer_id = b.customer_id
             ) 
              LIMIT ${offset},${page_size}`);
        return result;
    },


    //aging summary

    getAgingSummaryInvoice: async ({ offset, created_by, page_size, estimate, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT c.customer_display_name, 
            
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
            ${TABLE.INVOICES} i
            inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ${created_by} AND i.status = "0" AND i.estimate = '0'
            AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.customer_display_name 
            order by i.date_modified DESC LIMIT ${offset},${page_size}`);
        return result;
    },

    getAgingSummarySize: async ({ created_by, startDate, endDate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(DISTINCT c.id) count
            FROM 
            ${TABLE.CUSTOMER} c 
            left join ${TABLE.INVOICES} i on c.id = i.customer_id 
            left join ${TABLE.CREDIT_NOTE} n on n.customer_id = c.id 
            WHERE i.created_by = ${created_by} AND i.status = "0" AND i.estimate = '0' AND i.created_at BETWEEN ${startDate} AND ${endDate} `);
        return result.count;
    },






    getInvoicesAmount: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT  IFNULL(sum( CAST(SUBSTRING(replace(amount, ',', ''),5) AS DECIMAL(10,2))), 0) amount
            FROM
            ${TABLE.INVOICES}  
            WHERE created_by = ${created_by} AND created_at BETWEEN ${startDate} AND ${endDate} `);
        console.log(endDate)

        return result;
    },


   
    getInvoicesTaxAmount: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT IFNULL(sum( CAST(SUBSTRING(replace(tax_amount, ',', ''),5) AS DECIMAL(10,2))), 0) tax_amount  FROM
            ${TABLE.INVOICES}  
            WHERE created_by = ${created_by} AND created_at BETWEEN ${startDate} AND ${endDate} `);
        console.log(endDate)

        return result;
    },



    getInvoicesCreditNoteTax: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT IFNULL(sum( CAST(SUBSTRING(replace(tax_amount, ',', ''),5) AS DECIMAL(10,2))), 0) tax_amount  FROM
            ${TABLE.CREDIT_NOTE}  
            WHERE created_by = ${created_by} AND created_at BETWEEN ${startDate} AND ${endDate} `);
        console.log(endDate)

        return result;
    },

    getInvoicesCreditNoteVendorTax: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT IFNULL(sum( CAST(SUBSTRING(replace(tax_amount, ',', ''),5) AS DECIMAL(10,2))), 0) tax_amount  FROM
            ${TABLE.CREDIT_NOTE_VENDOR}  
            WHERE created_by = ${created_by} AND created_at BETWEEN ${startDate} AND ${endDate} `);
        console.log(endDate)

        return result;
    },


    getFrequencyInvoices: async ({ offset, created_by, estimate, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.start_time, i.end_time,i.due_amount, i.modified, i.status, i.frequecy, i.frequency_type, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? order by i.modified DESC LIMIT ?,?`, [created_by, offset, page_size]);
        return result;
    },

    getPageSizeFrequencyInvoice: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER}
             c on c.id = i.customer_id WHERE created_by = ?`, [created_by]);
        return result.count;
    },
    getFrequencyInvoicesFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.invoice_no = ?`, [filter_value]);
        return result;
    },

    updatefrequency: async ({ frequecy, invoice_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            frequecy = ?, 
            start_time = DATE_FORMAT(now(), "%Y-%m-%d %h:%i:%s")

            WHERE invoice_no = ? `,
            [frequecy, invoice_no]);
        return result;
    },

    updatefrequencystatus: async ({ invoice_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            status = 0
            WHERE invoice_no = ?`,
            [invoice_no]);
        return result;
    },


    updatefrequencystatus2: async ({ invoice_no }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            status = 1
            WHERE invoice_no = ?`,
            [invoice_no]);
        return result;
    },

    getfrequency: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_INVOICE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },


    getOneInvoices: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.terms, i.due_date, i.status, i.invoice_date, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
             i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? AND i.estimate = ?  AND i.email_sent = 0 order by i.date_modified LIMIT 1`, [created_by, estimate, offset]);
        return result;
    },

    getInvoiceFilter: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE i.created_by = ? AND i.invoice_no = ?`, [created_by, filter_value]);
        return result;
    },

    getInvoiceFilterUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
            i.customer_id = ? AND i.status=0 AND i.estimate=0 AND i.created_by  = ?`, [filter_value, created_by]);
        return result;
    },


    getInvoiceFilterPaidReceipt: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
             ${TABLE.INVOICES} WHERE
           payment_received_id = ?`, [filter_value]);
        return result;
    },

    getPageSizeInvoicePaidReceipt: async ({ filter_value }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM 
            ${TABLE.INVOICES} WHERE
          payment_received_id = ? `, [filter_value]);
        return result.count;
    },
    getPageSizeInvoiceUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id
             WHERE i.customer_id = ? 
            AND i.status=0 AND i.created_by = ? `, [filter_value, created_by]);
        return result.count;
    },

    getPageSizeInvoice: async ({ created_by, startDate, endDate, estimate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER}
             c on c.id = i.customer_id WHERE i.created_by = ${created_by} AND i.estimate = ${estimate}
              AND i.created_at BETWEEN ${startDate} AND ${endDate}
             `,);
        return result.count;
    },
    createEstimate: async ({ customer_id, estimate_no, expiry_date, estimate_date, estimate_message,
        statement_message, sub_total, amount, due_amount, tax_amount,
        discount_amount, created_by }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.ESTIMATES}  SET
        customer_id=?, estimate_no=?, expiry_date =?, estimate_date =?, estimate_message=?, statement_message=?, sub_total=?,
        amount=?, due_amount=?,
        tax_amount=?, 
        discount_amount=?,
         created_by=?`, [
            customer_id,
            estimate_no,
            expiry_date,
            estimate_date,
            estimate_message,
            statement_message,
            sub_total,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by
        ]);
        return result;
    },


    updateEstimate: async ({ customer_id, estimate_no, expiry_date, estimate_date, estimate_message,
        statement_message, sub_total, amount, due_amount, tax_amount,
        discount_amount, created_by }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.ESTIMATES} SET 
        pdf = ? T
        customer_id=?, estimate_no=?, expiry_date =?, estimate_date =?, estimate_message=?, statement_message=?, sub_total=?,
        amount=?, due_amount=?,
        tax_amount=?, 
        discount_amount=?,
         created_by=?
        WHERE estimate_no = ? `, [customer_id,
            estimate_no,
            expiry_date,
            estimate_date,
            estimate_message,
            statement_message,
            sub_total,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            created_by, estimate_no]);
        return query;
    },


    getEstimates: async ({ offset, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATES} WHERE created_by = ? LIMIT ?,10`, [offset, created_by]);
        return result;
    },

    getEstimateFilter: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATES} WHERE estimate_no LIKE ?`, [filter_value]);
        return result;
    },

    getPageSizeEstimates: async ({ created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.ESTIMATES} WHERE created_by = ?`, [created_by]);
        return result.count;
    },

    getInvoiceItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.INVOICE_ITEMS} WHERE invoice_no = ?`, [filter_value]);
        return result;
    },

    geteEstimateItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATE_ITEMS} WHERE estimate_no = ?`, [filter_value]);
        return result;
    },


};