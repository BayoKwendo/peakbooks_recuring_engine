import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import Invoices from "../interfaces/Invoices.ts";

export default {
    createInvoice: async ({ customer_id, invoice_no, currency_type, sales_order_no, terms, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, recurring, created_by, estimate, reference,agnaist_ksh, tax_exclusive, sales_person_id, approved }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.INVOICES}  SET
        customer_id=?, invoice_no = ?, terms=?, due_date =?, invoice_date =?, message_invoice=?,sub_total=?,
        statement_invoice=?,
        currency_type=?,
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        recurring=?,
        agnaist_ksh=?,
        created_by=?,
        estimate=?,
        sales_order_no = ?,
        tax_exclusive=?,
        sales_person_id=?,
        approved=?,
        reference=?`, [
            customer_id,
            invoice_no,
            terms,
            due_date,
            invoice_date,
            message_invoice,
            sub_total,
            statement_invoice,
            currency_type,
            amount,
            due_amount,
            tax_amount,
            discount_amount,
            recurring,
            agnaist_ksh,
            created_by,
            estimate,
            sales_order_no,
            tax_exclusive,
            sales_person_id,
            approved,
            reference
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


    //sales person
    //Tax Rates
    createTaxRate: async ({ tax_name, tax_value, created_by }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.TAX_RATES}  SET
        tax_name=?, 
        tax_value=?,
        created_by=?`, [
            tax_name,
            tax_value,
            created_by
        ]);
        return result;
    },

    editTaxRate: async ({ tax_name, tax_value, id, created_by }: Invoices) => {
        const result = await client.query(`UPDATE ${TABLE.TAX_RATES} 
        SET
        tax_name=?, 
        tax_value=?,
        created_by=? WHERE id = ?`, [
            tax_name,
            tax_value,
            created_by,
            id
        ]);
        return result;
    },

    getTaxRates: async ({ created_by }: Invoices,) => {
        const query = await client.query(`SELECT tax_name, tax_value, date_created, id FROM  ${TABLE.TAX_RATES}
        WHERE created_by = ? LIMIT 10000`, [created_by]);
        return query;
    },


    //Tax General Notes
    createNotes: async ({ invoice_notes, created_by }: Invoices) => {
        const result = await client.query(`INSERT INTO invoice_notes  SET
        invoice_notes = ?, 
        user_id = ?`, [
            invoice_notes,
            created_by
        ]);
        return result;
    },

    editNotes: async ({ invoice_notes, created_by }: Invoices) => {
        const result = await client.query(`UPDATE invoice_notes 
        SET
        invoice_notes =?
        WHERE user_id = ?`, [
            invoice_notes,
            created_by
        ]);
        return result;
    },

    getNotes: async ({ created_by }: Invoices,) => {
        const query = await client.query(`SELECT * FROM  invoice_notes
        WHERE user_id = ? LIMIT 10000`, [created_by]);
        return query;
    },


    deleteTaxRates: async ({ id }: Invoices,) => {
        const query = await client.query(`DELETE FROM  ${TABLE.TAX_RATES}
        WHERE id = ?`, [id]);
        return query;
    },


    deleteRecurringInvoices: async ({ id }: Invoices,) => {
        const query = await client.query(`DELETE FROM  ${TABLE.RECURRING_INVOICE}
        WHERE customer_id = ?`, [id]);
        return query;
    },


    deleteInvoices: async ({ id }: Invoices,) => {
        const query = await client.query(`DELETE FROM  ${TABLE.INVOICES}
        WHERE id = ?`, [id]);
        return query;
    },


    createSalesPerson: async ({ sales_person, created_by }: Invoices) => {
        const result = await client.query(`INSERT INTO ${TABLE.SALES_PERSON}  SET
        sales_person=?, 
        created_by=?`, [
            sales_person,
            created_by
        ]);
        return result;
    },

    getSalesPerson: async ({ created_by }: Invoices,) => {
        const query = await client.query(`SELECT sales_person, date_created, id FROM  ${TABLE.SALES_PERSON}
        WHERE created_by = ? LIMIT 10000`, [created_by]);
        return query;
    },


    deleteSalesPerson: async ({ id }: Invoices,) => {
        const query = await client.query(`DELETE FROM  ${TABLE.SALES_PERSON}
        WHERE id = ?`, [id]);
        return query;
    },



    updateInvoice: async ({ currency_type, customer_id, invoice_no, terms, approved, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, created_by, tax_exclusive }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} 
        SET
        currency_type=?,
        customer_id=?, 
        invoice_no=?, 
        terms=?, 
        due_date =?, 
        invoice_date =?, 
        message_invoice=?,
        sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive=?,
        approved= ?
        WHERE invoice_no = ? AND created_by=? `, [
            currency_type,
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
            approved,
            invoice_no,
            created_by]);
        return query;
    },


    getMaxmumInvoiceNo: async ({ created_by }: Invoices,) => {
        const [query] = await client.query(`
        select 
        IFNULL(max(invoice_no), 0)+1 count
        from ${TABLE.INVOICES} 
        where created_by = ? `, [created_by]);
        return query.count;
    },

    convertEstimate: async ({ invoice_no, id }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} SET 
        estimate = 0,
        approved= 0,
        invoice_no= ?
        WHERE id = ? `, [id, invoice_no]);
        return query;
    },

    convertSales: async ({ invoice_no, id }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} SET 
        sales_order_no = 0,
        approved= 0,
        invoice_no= ?
        WHERE id = ? `, [id, invoice_no]);
        return query;
    },

    getInvoices: async ({ offset, startDate, endDate, sales_order_no, created_by, estimate, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no,i.id, i.tax_exclusive, i.lock_reminder,i.currency_type, i.terms, i.approved,i.estimate_no, i.customer_id,
            CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount_invoice,
           
            DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) period,
           i.sales_order_no,
            i.due_date, i.currency_type, i.status, i.invoice_date, i.date_modified, i.discount_amount, i.recurring, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,

            i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
          
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            
            WHERE i.created_by = ${created_by} AND i.estimate = ${estimate} AND i.sales_order_no = ${sales_order_no}
              AND i.created_at BETWEEN ${startDate} AND ${endDate}
              
              order by i.invoice_no DESC, i.estimate_no DESC LIMIT ${offset},${page_size}`);
        return result;
    },

    //receivable summary
    getReceivableSummary: async ({ offset, startDate, endDate, created_by, estimate, page_size }: Invoices) => {
        const result = await client.query(
            `SELECT t.transaction,t.transaction_type,t.amount, t.customer_name, t.date_created, t.balance, t.status
             FROM (
            (
                 SELECT i.invoice_no transaction, 
              CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount,

              if(i.invoice_no, "Invoice", "Invoice") transaction_type,

              if(i.status = "1", 0, CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2))) balance,

              if(i.status = "1", "Sent", "Overdue") status,

              i.created_at date_created, c.customer_display_name customer_name  FROM
             ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
              WHERE i.created_by = ${created_by} AND i.estimate = ${estimate} AND
              i.approved = 1 AND i.sales_order_no = 0 AND
               i.created_at BETWEEN ${startDate} AND ${endDate} ) 
              UNION ALL

            (   
                SELECT i.credit_no transaction, 
                CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount,

                if(i.credit_no, "Credit Note", "Credit Note") transaction_type,

                if(i.status = "0", 0, CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2))) balance,

                if(i.status = "1", "Open", "Closed") status,

                i.created_at date_created, c.customer_display_name customer_name  
                FROM
             ${TABLE.CREDIT_NOTE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
             WHERE i.created_by = ${created_by} 
             AND i.created_at BETWEEN ${startDate} AND ${endDate}
             ) 
                UNION ALL

             (
            
              SELECT

              if(i.invoice_no, "Customer opening balance", "Cendor opening balance") transaction,

              CAST(c.balance_opening_balance AS DECIMAL(10,2)) amount,

              if(i.invoice_no, "Invoice", "Invoice") transaction_type,

              CAST(c.out_of_balance AS DECIMAL(10,2)) balance,

              if(i.status = "1", "Paid", "Overdue") status,

              i.created_at date_created, c.customer_display_name customer_name  
              
              FROM
              ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id
              WHERE i.created_by = ${created_by} AND
              i.approved = 1 AND i.sales_order_no = 0  
              AND i.created_at BETWEEN ${startDate} AND ${endDate}  GROUP BY c.out_of_balance 
              
              )


              
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

             (SELECT  c.out_of_balance, c.customer_display_name,
             COUNt(i.id) count,
             i.customer_id,
            CAST((sum(SUBSTRING(replace(IFNULL(i.amount, 0), ',', ''),5)) + IFNULL(c.out_of_balance, 0)) AS DECIMAL(10,2)) invoice_amount
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
             i.approved = 1 AND i.sales_order_no = 0 AND
             (i.created_at BETWEEN ${startDate} AND ${endDate} OR 
             n.created_at BETWEEN ${startDate} AND ${endDate})
             `);
        return result.count;
    },



    //sales person sales report

    getSalesPersonReport: async ({ offset, created_by, page_size, estimate, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT 
            sales_person, IFNULL(count, 0) invoice_counts, IFNULL(counts, 0) credit_note_counts,
            (IFNULL(invoice_amount, 0) - IFNULL(credit_amount, 0)) sales_with_tax, 
            IFNULL(invoice_amount, 0)-(IFNULL(credit_tax, 0)+IFNULL(invoice_tax, 0)+IFNULL(credit_amount, 0)) sales
            
             FROM (

             (SELECT  c.sales_person,
             IFNULL(COUNt(i.id), 0) count,
             i.sales_person_id,
             sum( CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) invoice_amount, 
             sum( CAST(SUBSTRING(replace(i.tax_amount, ',', ''),5) AS DECIMAL(10,2))) invoice_tax 
             from
             ${TABLE.SALES_PERSON} c
             left join  ${TABLE.INVOICES} i on c.id = i.sales_person_id
             WHERE i.created_by = ${created_by} AND  i.estimate = '0' AND i.approved = 1 AND i.sales_order_no = 0
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.sales_person) a

             left join

             ( SELECT  
             d.sales_person customer,
             IFNULL(COUNt(n.id), 0) counts,
              n.sales_person_id,
             sum( CAST(SUBSTRING(replace(n.tax_amount, ',', ''),5) AS DECIMAL(10,2))) credit_tax, 
             sum( CAST(SUBSTRING(replace(n.amount, ',', ''),5) AS DECIMAL(10,2))) credit_amount
             from
             ${TABLE.SALES_PERSON} d
             left join  ${TABLE.CREDIT_NOTE} n on n.sales_person_id = d.id
             WHERE n.created_by = ${created_by} 
             AND n.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY d.sales_person) b
             
             on a.sales_person_id = b.sales_person_id
             ) 
              LIMIT ${offset},${page_size}`);
        return result;
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
             WHERE i.created_by = ${created_by} AND i.estimate = '0' AND i.approved = 1 AND i.sales_order_no = 0 
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
            
             sum(CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2))) total_amount,

             sum( if ( DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 0,
             CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2)),0)) as current_amount,

             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 16  
             AND
             DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 0),
             CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_15,

             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 31  
             AND
             DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 15),
             CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_15_30,

             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) < 46  
             AND
             DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 30),
             CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_30_45,


             sum( if ( (DATEDIFF (DATE_FORMAT(NOW(), '%Y-%m-%d'), DATE_FORMAT(i.due_date, '%Y-%m-%d')) > 45 ),
             CAST(SUBSTRING(replace(i.due_amount, ',', ''),5) AS DECIMAL(10,2)),0)) as overdue_45

             FROM 
            ${TABLE.INVOICES} i
            inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ${created_by} AND i.status = "0" AND i.approved = 1 AND i.sales_order_no = 0 AND i.estimate = '0'
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
            `SELECT  IFNULL(sum( CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))), 0) amount
            FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id
            WHERE created_by = ${created_by} AND i.estimate=0 AND i.sales_order_no=0 AND i.approved= 1 AND i.approved = 1 AND i.created_at BETWEEN ${startDate} AND ${endDate}`);
        console.log(endDate)

        return result;
    },



    getInvoicesAmountRatio: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT MONTH(created_at),created_at, IFNULL(sum( CAST(SUBSTRING(replace(amount, ',', ''),5) AS DECIMAL(10,2))), 0) amount
            FROM
            ${TABLE.INVOICES}  
            WHERE created_at >= date_sub(NOW(), INTERVAL 6 MONTH) AND estimate=0 AND  created_by = ${created_by} AND created_at BETWEEN ${startDate} AND ${endDate} GROUP BY MONTH(created_at)`);
        console.log(endDate)

        return result;
    },


    getInvoicesTaxAmount: async ({ created_by, startDate, endDate }: Invoices) => {
        const result = await client.query(
            `SELECT IFNULL(sum( CAST(SUBSTRING(replace(tax_amount, ',', ''),5) AS DECIMAL(10,2))), 0) tax_amount  FROM
            ${TABLE.INVOICES}  
            WHERE created_by = ${created_by} AND estimate=0 AND created_at BETWEEN ${startDate} AND ${endDate} `);
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
            `SELECT i.invoice_no, i.start_time, i.end_time, i.id, i.due_amount, i.modified, i.status, i.frequecy, i.frequency_type, c.customer_display_name,c.email, c.company_name  FROM
            ${TABLE.RECURRING_INVOICE} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? order by i.id DESC LIMIT ?,?`, [created_by, offset, page_size]);
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


    updatefrequencystatus2: async ({ invoice_no, frequecy, frequency_type }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_INVOICE} SET 
            status = 1,
            frequecy = ?,
            frequency_type = ?
            WHERE invoice_no = ?`,
            [frequecy, frequency_type, invoice_no]);
        return result;
    },

    getfrequency: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_INVOICE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },




    getOneInvoices: async ({ offset, created_by, estimate }: Invoices) => {
        const result = await client.query(
            `SELECT i.invoice_no, i.terms, i.due_date, i.status,i.id, i.invoice_date, i.approved, i.discount_amount, i.sub_total, i.tax_amount, i.message_invoice,i.statement_invoice,
             i.due_amount, i.amount, c.customer_display_name,c.email, c.company_name  FROM 
            ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
            WHERE i.created_by = ? AND i.estimate = ?  AND i.email_sent = 0 AND i.approved = 1  order by i.date_modified LIMIT 1`, [created_by, estimate, offset]);
        return result;
    },

    getInvoiceFilter: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
           WHERE i.estimate=0 and i.sales_order_no=0 and i.created_by = ? AND i.invoice_no = ?`, [created_by, filter_value]);
        return result;
    },

    getInvoiceFilterEstimate: async ({ created_by, filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id 
           WHERE i.estimate=1 and i.created_by = ? AND i.estimate_no = ?`, [created_by, filter_value]);
        return result;
    },

    getInvoiceFilterUnpaid: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM 
           ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER} c on c.id = i.customer_id WHERE
            i.customer_id = ? AND i.status=0 AND i.approved=1 AND i.estimate=0 AND i.created_by  = ? LIMIT 100`, [filter_value, created_by]);
        return result;
    },


    getInvoiceFilterPaidReceipt: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `

            SELECT t.invoice_no, t.invoice_date, t.due_amount, t.amount
             FROM (

             (
                SELECT
                open_balance_id invoice_no,
                created_on invoice_date,
                balance due_amount,
                amount amount
                FROM
                opening_balances_sales
                WHERE
                payment_received_id = ${filter_value}
            )
                            UNION All

            (
                SELECT
                invoice_no invoice_no,
                invoice_date invoice_date ,
                due_amount due_amount,
                amount amount
                FROM
                invoices WHERE
              payment_received_id = ${filter_value}
            )
            
            ) AS t`);
        return result;
    },


    getInvoiceFilterPaidTransactions: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT t.invoice_no,t.payment_received_id,t.invoice_amount, t.invoice_date, t.due_amount, t.amount
             FROM (

             (
                SELECT
                open_balance_id invoice_no,
                created_on invoice_date,
                balance due_amount,
                payment_received_id payment_received_id,
                amount amount,
                amount invoice_amount,
                client_id created_by
                FROM
                opening_balances_sales
                WHERE
                payment_received_id = ${filter_value}
            )
                            UNION All
            (
                SELECT
                i.invoice_no invoice_no,
                i.invoice_date invoice_date,
                s.balance due_amount,
                s.payment_received_id payment_received_id,
                s.amount amount,
                i.amount invoice_amount,
                i.created_by created_by
                FROM
                invoice_paymentreceived_sales s inner join invoices i on s.invoice_no = i.invoice_no WHERE
              s.payment_received_id = ${filter_value} AND i.created_by = ${created_by}
            )
            UNION All

            (
                SELECT
                invoice_no invoice_no,
                invoice_date invoice_date ,
                due_amount due_amount,
                payment_received_id payment_received_id,
                amount amount,
                amount invoice_amount,
                created_by created_by
                FROM
                invoices WHERE
              payment_received_id = ${filter_value} AND created_by = ${created_by} 
            )             
            ) AS t`);
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

    getPageSizeInvoice: async ({ created_by, startDate, sales_order_no, endDate, estimate }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(i.id) count FROM ${TABLE.INVOICES} i inner join ${TABLE.CUSTOMER}
             c on c.id = i.customer_id WHERE i.created_by = ${created_by} AND i.estimate = ${estimate}
              AND i.sales_order_no = ${sales_order_no}
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


    // : async ({ customer_id, estimate_no, expiry_date, estimate_date, estimate_message,
    //     statement_message, sub_total, amount, due_amount, tax_amount,
    //     discount_amount, created_by }: Invoices,) => {
    //     const query = await client.query(`UPDATE ${TABLE.ESTIMATES} SET 
    //     pdf = ? T
    //     customer_id=?, estimate_no=?, expiry_date =?, estimate_date =?, estimate_message=?, statement_message=?, sub_total=?,
    //     amount=?, due_amount=?,
    //     tax_amount=?, 
    //     discount_amount=?,
    //      created_by=?
    //     WHERE estimate_no = ? `, [customer_id,
    //         estimate_no,
    //         expiry_date,
    //         estimate_date,
    //         estimate_message,
    //         statement_message,
    //         sub_total,
    //         amount,
    //         due_amount,
    //         tax_amount,
    //         discount_amount,
    //         created_by, estimate_no]);
    //     return query;
    // },



    updateEstimate: async ({ customer_id, invoice_no, terms, approved, due_date, invoice_date, message_invoice, sub_total, statement_invoice, amount,
        due_amount, tax_amount, discount_amount, created_by, tax_exclusive }: Invoices,) => {
        const query = await client.query(`UPDATE ${TABLE.INVOICES} 
        SET
        customer_id=?, 
        estimate_no=?, 
        terms=?, 
        due_date =?, 
        invoice_date =?, 
        message_invoice=?,
        sub_total=?, 
        statement_invoice=?, 
        amount=?, 
        due_amount=?,
        tax_amount=?, 
        discount_amount=?,
        created_by=?,
        tax_exclusive=?,
        approved=?
        WHERE estimate_no = ? AND created_by=? `, [
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
            approved,
            invoice_no,
            created_by]);
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

    getInvoiceItems: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.INVOICE_ITEMS} WHERE invoice_no = ? AND client_id = ?`, [filter_value, created_by]);
        return result;
    },





    updateInvoiceItems: async ({ invoice_no, filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.INVOICE_ITEMS} SET invoice_no = ? WHERE invoice_no = ? AND client_id = ?`, [invoice_no, filter_value, created_by]);
        return result;
    },


    updateInvoiceSent: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `UPDATE ${TABLE.INVOICES} SET status = 3, approved = 1 WHERE id = ?`, [filter_value]);
        return result;
    },

    // delete invoice items
    getInvoiceDeleteItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `DELETE FROM ${TABLE.INVOICE_ITEMS} WHERE id = ?`, [filter_value]);
        return result;
    },


    // delete paymnet
    getDeletePayments: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `DELETE FROM ${TABLE.PAYMENT_RECEIVED_PAY} WHERE id = ?`, [filter_value]);
        return result;
    },



    // delete invoice items for invoice
    invoiceDeleteItems: async ({ filter_value, created_by }: Invoices) => {
        const result = await client.query(
            `DELETE FROM ${TABLE.INVOICE_ITEMS} WHERE invoice_no = ? AND client_id = ?`, [filter_value, created_by]);
        return result;
    },


    //select items
    selectItemQuantity: async ({ item_name, quantity, created_by }: Invoices) => {
        const [query] = await client.query(`SELECT quantity FROM ${TABLE.ITEMS} 
         WHERE item_name = ? AND client_id = ?`, [item_name, created_by]);
        return query;
    },

    // update item quantity
    updateItemQuantity: async ({ item_name, quantity, created_by }: Invoices) => {
        const query = await client.query(`UPDATE ${TABLE.ITEMS} SET 
         quantity = ? 
         WHERE item_name = ? AND client_id = ?`, [quantity, item_name, created_by]);
        return query;
    },







    getInvoiceItemDelete: async ({ filter_value, created_by }: Invoices) => {
        const [result] = await client.query(
            `SELECT COUNT(*) count FROM  ${TABLE.INVOICE_ITEMS} WHERE invoice_no = ? AND client_id = ?`, [filter_value, created_by]);
        return result.count;
    },



    geteEstimateItems: async ({ filter_value }: Invoices) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.ESTIMATE_ITEMS} WHERE estimate_no = ?`, [filter_value]);
        return result;
    },


};