import client from "../db/client.ts";
import { TABLE } from "../db/config.ts";
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import Vendor from "../interfaces/Vendor.ts";

export default {
    createVendor: async ({ client_id, title, first_name, other_name,
        msisdn, email, company_name, vendor_display_name, website, street, city_town, state_province, country, street1,
        city_town1, state_province1, country1, remarks, terms, opening_balance, tax_info }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.VENDORS}  SET
              client_id=?, title=?,
              first_name =?, other_name =?,
              msisdn=?, email =?, company_name=?,
              vendor_display_name=?, website=?, 
              street=?, city_town=?, state_province=?, country=?, 
              street1=?, city_town1=?, state_province1=?, country1=?, 
              remarks=?, terms=?, opening_balance=?, tax_info=?`, [
            client_id,
            title,
            first_name,
            other_name,
            msisdn,
            email,
            company_name,
            vendor_display_name,
            website,
            street,
            city_town,
            state_province,
            country,
            street1,
            city_town1,
            state_province1,
            country1,
            remarks,
            terms,
            opening_balance,
            tax_info
        ]);
        return result;
    },



    updateVendor: async ({ client_id, title, first_name, other_name,
        msisdn, email, company_name, vendor_display_name, website, street, city_town, state_province, country, street1,
        city_town1, state_province1, country1, remarks, terms, opening_balance, id, tax_info }: Vendor) => {
        const result = await client.query(`UPDATE ${TABLE.VENDORS}  SET
              client_id=?, title=?,
              first_name =?, other_name =?,
              msisdn=?, email =?, company_name=?,
              vendor_display_name=?, website=?, 
              street=?, city_town=?, state_province=?, country=?, 
              street1=?, city_town1=?, state_province1=?, country1=?, 
              remarks=?, terms=?, opening_balance=?, tax_info=? WHERE id=?`, [
            client_id,
            title,
            first_name,
            other_name,
            msisdn,
            email,
            company_name,
            vendor_display_name,
            website,
            street,
            city_town,
            state_province,
            country,
            street1,
            city_town1,
            state_province1,
            country1,
            remarks,
            terms,
            opening_balance,
            tax_info,
            id
        ]);
        return result;
    },


    createExpense: async ({ client_id, date, expense_account, amount, paid_through, recurring,reference, customer_id, vendor_id, billable, product_name, notes, tax_amount }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.EXPENSES}  SET
              client_id=?, date =?,
              expense_account=?, amount =?, paid_through=?,
              customer_id=?, vendor_id=?, 
              notes=?,billable=?,product=?, tax_amount= ?,recurring=?, reference = ?`, [
            client_id, date, expense_account, amount, paid_through, customer_id,
            vendor_id, notes, billable, product_name, tax_amount, recurring, reference
        ]);
        return result;
    },


    editExpense: async ({ client_id, date, expense_account, amount, id, paid_through, recurring,
        customer_id, vendor_id, billable, product_name, notes,
        tax_amount }: Vendor) => {
        const result = await client.query(`UPDATE ${TABLE.EXPENSES}  
              SET
              client_id=?, 
              date =?,
              expense_account=?, 
              amount =?, 
              paid_through=?,
              customer_id=?, 
              vendor_id=?, 
              notes=?,
              billable =?,
              product = ?, 
              tax_amount = ?,
              recurring = ? 
              WHERE id = ?`, [client_id, date,
            expense_account, amount, paid_through, customer_id,
            vendor_id, notes, billable, product_name, tax_amount, recurring, id
        ]);
        return result;
    },

    

    deleteExpense: async ({ id }: Vendor) => {
        const result = await client.query(`DELETE FROM ${TABLE.EXPENSES} WHERE id = ?`, [id]);
        return result;
    },

    getExpense: async ({ id }: Vendor) => {
        const result = await client.query(`SELECT * FROM ${TABLE.EXPENSES} WHERE id = ?`, [id]);
        return result;
    },

    deleteExpenseRecurring: async ({ expense_ref }: Vendor) => {
        const result = await client.query(`DELETE FROM ${TABLE.RECURRING_EXPENSE} WHERE expense_ref = ?`, [expense_ref]);
        return result;
    },


    createRecurringExpense: async ({ start_time, end_time, customer_id, frequecy, vendor_id, created_by, frequency_type }: Vendor) => {
        const result = await client.query(`INSERT INTO ${TABLE.RECURRING_EXPENSE}  SET
        start_time=?, 
        end_time =?, 
        customer_id =?,
        frequecy =?,
        frequency_type=?,
        created_by=?,
        vendor_id =?,
        last_updated = '1',
        status ='1'`, [
            start_time,
            end_time,
            customer_id,
            frequecy,
            frequency_type,
            created_by,
            vendor_id
        ]);
        return result;
    },

    // createAddress: async ({
    //     customer_id, street, city_town, state_province, country, tax_info,
    //     notes, payment_method, delivery_method, terms, out_of_balance }: Vendor) => {
    //     const result = await client.query(`INSERT INTO ${TABLE.CUSTOMER_MORE}
    //       SET
    //       customer_id=?, street=?, city_town=?, state_province=?, country=?, tax_info=?, 
    //       notes=?, payment_method=?, delivery_method=?, terms=?, out_of_balance=?`,
    //         [
    //             customer_id,
    //             street,
    //             city_town,
    //             state_province,
    //             country,
    //             tax_info,
    //             notes,
    //             payment_method,
    //             delivery_method,
    //             terms,
    //             out_of_balance
    //         ]);
    //     return result;
    // },

    //vendor balance report

    //Customer balance report query
    getVendorBalanceBills: async ({ offset, created_by, page_size, startDate, endDate }: Vendor) => {
        const result = await client.query(
            `SELECT 

            vendor_display_name, IFNULL(bill_amount, 0) bill_balance,
            (IFNULL(bill_amount, 0) - IFNULL(credit_amount, 0)) balance,
            IFNULL(credit_amount, 0) excess_amount
            FROM
            (
            ( 
             SELECT c.opening_balance, c.vendor_display_name, i.vendor_id,
             CAST((sum(SUBSTRING(replace(IFNULL(i.amount, 0), ',', ''),5)) + IFNULL(c.opening_balance, 0)) AS DECIMAL(10,2)) bill_amount
             FROM
             ${TABLE.BILLS} i 
             inner join ${TABLE.VENDORS} c on c.id = i.vendor_id
             WHERE
             i.created_by = ${created_by} AND i.status = "0" 
             AND i.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name 
             ) a
             
             left join 

             ( SELECT  d.vendor_display_name vendor,
                                      n.vendor_id,
             sum( CAST(SUBSTRING(replace(n.due_amount, ',', ''),5) AS DECIMAL(10,2))) credit_amount
             from
             ${TABLE.VENDORS} d
             left join  ${TABLE.CREDIT_NOTE_VENDOR} n on n.vendor_id = d.id
             WHERE n.created_by = ${created_by} AND n.status = "1"
             AND n.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY d.vendor_display_name) b
             on a.vendor_id = b.vendor_id  ) 
              LIMIT ${offset},${page_size}`);
        return result;
    },


    //payable summary
    getPayableSummary: async ({ offset, startDate, endDate, created_by, page_size }: Vendor) => {
        const result = await client.query(
            `
            
            
     SELECT t.transaction,t.transaction_type,t.amount, t.vendor_name, t.date_created, t.balance, t.status
 FROM (

            (SELECT
            
              i.bill_no transaction,

              CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2)) amount,

              if(i.bill_no, "Bill", "Bill") transaction_type,

              if(i.status = "1", 0, CAST(SUBSTRING(replace(i.amount, ',', ''),5) AS DECIMAL(10,2))) balance,

              if(i.status = "1", "Paid", "Overdue") status,

              i.created_at date_created, c.vendor_display_name vendor_name  FROM
             ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
              WHERE i.created_by = ${created_by}  
              AND i.created_at BETWEEN ${startDate} AND ${endDate} )
              
              UNION ALL

             (SELECT 
              
              if(i.bill_no, "Vendor opening balance", "Vendor opening balance") transaction,

              CAST(c.opening_balance AS DECIMAL(10,2)) amount,

              if(i.bill_no, "Bill", "Bill") transaction_type,

              if(i.status = "1", 0, CAST(c.opening_balance AS DECIMAL(10,2))) balance,

              if(i.status = "1", "Paid", "Overdue") status,

              i.created_at date_created, c.vendor_display_name vendor_name  FROM
              ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
              WHERE i.created_by = ${created_by}  
              AND i.created_at BETWEEN ${startDate} AND ${endDate}  GROUP BY c.opening_balance )
              ) t
             order by t.date_created DESC
             LIMIT ${offset},${page_size}
            `

        );
        return result;
    },


    //payable summary
    getPayableSummarySize: async ({ offset, startDate, endDate, created_by, page_size }: Vendor) => {
        const [result] = await client.query(
            `
     SELECT COUNT(t.counts) count FROM (

            (SELECT i.bill_no counts
                FROM
             ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
              WHERE i.created_by = ${created_by}  
              AND i.created_at BETWEEN ${startDate} AND ${endDate} )
              
              UNION ALL

             (SELECT i.vendor_id counts
                FROM
              ${TABLE.BILLS} i inner join ${TABLE.VENDORS} c on c.id = i.vendor_id 
              WHERE i.created_by = ${created_by}  
              AND i.created_at BETWEEN ${startDate} AND ${endDate}  GROUP BY c.opening_balance )
              ) t
            `

        );
        return result.count;
    },


    getVendorSales: async ({ offset, created_by, page_size, startDate, endDate }: Vendor) => {
        const result = await client.query(
            `SELECT 
             
            vendor_display_name, IFNULL(count, 0) bill_count, 
            
            IFNULL(counts, 0) credit_count,
             
            IFNULL(count_expense, 0) expense_count,
           
            ((IFNULL(bill_amount, 0) + IFNULL(expense_amount, 0))  - IFNULL(credit_amount, 0)) purchase_with_tax,
            
            IFNULL(expense_amount, 0),
             
            (IFNULL(bill_amount, 0) + IFNULL(expense_amount, 0))-(IFNULL(credit_tax, 0)+IFNULL(bill_tax, 0)+IFNULL(credit_amount, 0)) purchases
            
             FROM (
             (SELECT  c.vendor_display_name,
             COUNt(b.id) count,
             b.vendor_id,
             sum( CAST(SUBSTRING(replace(b.amount, ',', ''),5) AS DECIMAL(10,2))) bill_amount, 
             sum( CAST(SUBSTRING(replace(b.tax_amount, ',', ''),5) AS DECIMAL(10,2))) bill_tax 
             from
             ${TABLE.BILLS} b
             left join  ${TABLE.VENDORS} c on c.id = b.vendor_id 
             WHERE b.created_by = ${created_by}  
             AND b.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name) a
             left join
             ( 
             SELECT  
             d.vendor_display_name vendor,
             COUNt(n.id) counts,
             n.vendor_id,
             sum( CAST(SUBSTRING(replace(n.tax_amount, ',', ''),5) AS DECIMAL(10,2))) credit_tax, 
             sum( CAST(SUBSTRING(replace(n.amount, ',', ''),5) AS DECIMAL(10,2))) credit_amount
             from
             ${TABLE.VENDORS} d 
             left join  ${TABLE.CREDIT_NOTE_VENDOR} n on n.vendor_id = d.id
             WHERE n.created_by = ${created_by} 
             AND n.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY d.vendor_display_name) b
             on a.vendor_id = b.vendor_id
             
             left join
             (
             SELECT  c.vendor_display_name vendor_name_expense,
             COUNt(e.id) count_expense,
             e.vendor_id,
             sum(CAST(e.amount AS DECIMAL(10,2))) expense_amount
             from
             ${TABLE.EXPENSES} e
             left join  ${TABLE.VENDORS} c on c.id = e.vendor_id 
             WHERE e.client_id = ${created_by}
             AND e.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name) c
              on b.vendor_id = c.vendor_id
            )  
           
              LIMIT ${offset},${page_size}`);
        return result;
    },


    getExpensesVendor: async ({ offset, created_by, page_size, startDate, endDate }: Vendor) => {
        const result = await client.query(
            `SELECT 
             
            vendor_name_expense, 
            
            IFNULL(count_expense, 0) expense_count,
            
            IFNULL(tax_expense_amount, 0) purchase_with_tax,
            
            IFNULL(expense_amount, 0) expense_amount
            
            FROM (
                (
                SELECT  c.vendor_display_name vendor_name_expense,
                COUNt(e.id) count_expense,
                e.vendor_id,
                sum(CAST(e.amount AS DECIMAL(10,2))) expense_amount,
                sum(CAST(e.tax_amount AS DECIMAL(10,2))) tax_expense_amount
                from
                ${TABLE.EXPENSES} e
                left join  ${TABLE.VENDORS} c on c.id = e.vendor_id 
                WHERE e.client_id = ${created_by}
                AND e.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name
                ) c
               )
   
           
              LIMIT ${offset},${page_size}`);
        return result;
    },


    getVendorSalesSize: async ({ created_by, startDate, endDate }: Vendor) => {
        const [result] = await client.query(
            `SELECT 
             COUNT(vendor_display_name) count 
             FROM (
             (SELECT  c.vendor_display_name,
             b.vendor_id
             from
             ${TABLE.BILLS} b
             left join  ${TABLE.VENDORS} c on c.id = b.vendor_id 
             WHERE b.created_by = ${created_by}  
             AND b.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name) a

             left join

             ( 
             SELECT  
             d.vendor_display_name vendor,
             n.vendor_id
             from
             ${TABLE.VENDORS} d 
             left join  ${TABLE.CREDIT_NOTE_VENDOR} n on n.vendor_id = d.id
             WHERE n.created_by = ${created_by} 
             AND n.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY d.vendor_display_name) b
             on a.vendor_id = b.vendor_id
             
             left join

             (
             SELECT  c.vendor_display_name vendor_name_expense,
             COUNt(e.id) count_expense,
             e.vendor_id
             from
             ${TABLE.EXPENSES} e
             left join  ${TABLE.VENDORS} c on c.id = e.vendor_id 
             WHERE e.client_id = ${created_by}
             AND e.created_at BETWEEN ${startDate} AND ${endDate} GROUP BY c.vendor_display_name) c
              on b.vendor_id = c.vendor_id
            )  
           `);
        return result.count;
    },



    getVendorBalanceBillsSize: async ({ created_by, startDate, endDate }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(DISTINCT c.id) count
            FROM 
            ${TABLE.VENDORS} c 
            left join ${TABLE.BILLS} i on c.id = i.vendor_id 
            left join ${TABLE.CREDIT_NOTE_VENDOR} n on n.vendor_id = c.id
            WHERE (i.created_by = ${created_by} OR n.created_by = ${created_by}) AND (i.status = "0" OR n.status = "1")  AND (i.created_at BETWEEN ${startDate} AND ${endDate} OR n.created_at BETWEEN ${startDate} AND ${endDate})  `);
        return result.count;
    },






    getAll: async ({ offset, client_id, page_size }: Vendor) => {
        const query = await client.query(`SELECT * FROM ${TABLE.VENDORS} 
        WHERE client_id = ? ORDER BY id DESC LIMIT ?,?`, [client_id, offset, page_size]);
        return query;
    },

    getExpenseReport: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(sum(IFNULL(amount, 0 )), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Cost of Goods Sold" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },




    getCreditNoteVendor: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT 
            IFNULL(sum(CAST(SUBSTRING(replace(due_amount, ',', ''),5) AS DECIMAL(10,2))), 0) due_amount 
         FROM ${TABLE.CREDIT_NOTE_VENDOR} WHERE 
        created_by = ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },





    getEmployeeAdvance: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Employee Advance" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getEmployeeAdvanceExpense: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Employee Advance" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    getPrepaidExpenses: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Prepaid Expenses" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },





    getPettyCash: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT 
        IFNULL(SUM(amount), 0) 
        amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Petty Cash" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}    
        `);
        return query;
    },







    getUndepositedFunds: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(SUM(amount), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Undeposited Funds" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getReimbursements: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Employee Reimbursements" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    othercurrentasset: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(SUM(amount), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Other current assets" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    othernoncurrent: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(SUM(amount), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Other non-current assets" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    intangibleasset: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(SUM(amount), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Intangible Assets" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getReimbursementsCredit: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Employee Reimbursements" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },
    getAdvanceTax: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Advance Tax" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getAdvanceTaxPaid: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Advance Tax" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getTaxpayable: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT SUM(IFNULL(amount, 0)) amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Tax Payable" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    getFurnitureandEquipment: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Furniture and Equipment" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getFurnitureandEquipmentCredit: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Furniture and Equipment" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    getOffsetBalance: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT SUM(amount) amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Opening balance offset" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getDrawings: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(sum(amount), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Drawings" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getPrepaidExpensesDebit: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT amount FROM ${TABLE.EXPENSES} WHERE 
        expense_account = "Prepaid Expenses" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getTaxAmountTaxExpense: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT 
         IFNULL(sum(tax_amount), 0) tax_amount
         FROM ${TABLE.EXPENSES} WHERE 
        client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },

    getTaxpayablePaid: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT IFNULL(sum(amount), 0) amount FROM ${TABLE.EXPENSES} WHERE 
        paid_through = "Tax Payable" AND client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}`);
        return query;
    },


    getExpenseReportExpenseCost: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT 

          t.amount
        
        FROM (

            (SELECT 
              IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Employee Advance") AND 
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )
            UNION  ALL

             ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            (expense_account = "Rent Expense") AND 
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Consultant Expense") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )
            
            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Depreciation Expense") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            (
                 expense_account = "Credit Card Charges"
                 OR
                expense_account = "Bank Fees and Charges"    
            ) AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )



           UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            (
             expense_account = "Advertising And Marketing" or
             expense_account = "Bad Debt" or
             expense_account = "Automatic Expense" or
             expense_account = "IT and Internet Expenses" or
             expense_account = "Janitorial Expense" or
             expense_account = "Lodging" or
             expense_account = "Meals and Entertainment" or
             expense_account = "Office and Supplies" or
             expense_account = "Postage" or
             expense_account = "Printing and Stationary" or
            expense_account = "Repair and Maintenance" or
            expense_account = "Salaries and Employee Wages" or
            expense_account = "Travel Expenses" or
            expense_account = "Telephone Expense")
             
             AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )


             UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            (
                expense_account = "Other Expenses" 
            ) AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )



            ) t
            
            `);
        return query;
    },



    getLiability: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT 

          t.amount
        
        FROM (

            (SELECT 
              IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Short term loan") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )
            UNION  ALL

             ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            (expense_account = "Long term loan") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Short term related parties") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )
            
            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Long term related parties") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Other current liability") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )
            
            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.EXPENSES} WHERE
            ( expense_account = "Other non-current liability") AND
            client_id= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            ) t
            
            `);
        return query;
    },


    getInvestmentReport: async ({ client_id, startDate, endDate }: Vendor) => {
        const query = await client.query(`SELECT 

          t.amount
        
        FROM (

            (SELECT 
              IFNULL(sum(amount), 0) amount from ${TABLE.INVESTMENT} WHERE
            ( investment_type = "Bank Interest") AND
            created_by= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )
            UNION  ALL

             ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.INVESTMENT} WHERE
             (investment_type = "Insurance") AND
             created_by= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            UNION ALL

            ( SELECT
             IFNULL(sum(amount), 0) amount from ${TABLE.INVESTMENT} WHERE
            ( investment_type = "Other Investments") AND
            created_by= ${client_id} AND created_at BETWEEN ${startDate} AND ${endDate}
            )

            ) t
            
            `);
        return query;
    },


    //get expense account fpor journals
    getExpensesJournal: async ({ client_id }: Vendor) => {
        const query = await client.query(`SELECT  i.id, i.expense_account, i.amount, i.paid_through
        FROM (( ${TABLE.EXPENSES} i
        left join ${TABLE.VENDORS} v ON i.vendor_id = v.id )
        left join ${TABLE.CUSTOMER} c ON i.customer_id = c.id) WHERE i.client_id = ? ORDER BY i.id DESC LIMIT 1000`, [client_id]);
        return query;
    },

    getExpenses: async ({ offset, client_id, page_size }: Vendor) => {
        const query = await client.query(`SELECT i.date,i.tax_amount,i.id,i.created_at,i.recurring,  i.expense_account,  c.customer_display_name, v.vendor_display_name, i.paid_through,i.reference, i.billable,i.product,i.notes, i.amount
        FROM (( ${TABLE.EXPENSES} i
        left join ${TABLE.VENDORS} v ON i.vendor_id = v.id)
        left join ${TABLE.CUSTOMER} c ON i.customer_id = c.id) WHERE i.client_id = ? order by i.id DESC LIMIT ?,?`, [client_id, offset, page_size]);
        return query;
    },

    getPageSizeExpense: async ({ client_id }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.EXPENSES} WHERE client_id = ?`, [client_id]);
        return result.count;
    },

    getVendorBalance: async ({ client_id, startDate, endDate }: Vendor) => {
        const result = await client.query(
            `SELECT IFNULL(SUM(opening_balance),0) opening_balance  FROM  ${TABLE.VENDORS}  WHERE
             client_id = ${client_id} AND 
             created_at BETWEEN ${startDate} AND ${endDate}`);
        return result;
    },


    getExpenseFilter: async ({ filter_value }: Vendor) => {
        const query = await client.query(`SELECT i.date, i.expense_account, 
         c.customer_display_name, v.vendor_display_name, i.paid_through,i.reference, i.billable,i.product,i.notes, i.amount
        FROM (( ${TABLE.EXPENSES} i
        INNER JOIN ${TABLE.VENDORS} v ON i.vendor_id = v.id)
        INNER JOIN ${TABLE.CUSTOMER} c ON i.customer_id = c.id) WHERE i.reference = ?`, [filter_value]);
        return query;
    },

    getRecurringExpenses: async ({ offset, client_id, page_size }: Vendor) => {
        const query = await client.query(`SELECT i.date, i.expense_account, i.tax_amount, r.status,r.frequecy,r.expense_ref,
         v.vendor_display_name, r.frequency_type, r.start_time, r.end_time, 
         i.paid_through,i.reference, i.billable,i.product,i.notes, i.amount
        FROM  ${TABLE.RECURRING_EXPENSE} r
        left join ${TABLE.EXPENSES} i ON r.expense_ref = i.reference
        left join ${TABLE.VENDORS} v ON r.vendor_id = v.id
        left join ${TABLE.CUSTOMER} c ON r.customer_id = c.id  WHERE r.created_by = ? order by r.id DESC LIMIT ?, ?`, [client_id, offset, page_size]);
        return query;
    },

    getPageSizeExpenseRe: async ({ client_id }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.RECURRING_EXPENSE} WHERE created_by = ?`, [client_id]);
        return result.count;
    },


    getfrequencyExpense: async () => {
        const [result] = await client.query(
            `SELECT * FROM  ${TABLE.RECURRING_EXPENSE} WHERE frequecy < UNIX_TIMESTAMP(NOW()) AND status = 1 order by id ASC limit 1`);
        return result;
    },


    updatefrequencyExpenses: async ({ frequecy, reference }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            frequecy = ?, 
            start_time = DATE_FORMAT(now(), "%Y-%m-%d %h:%i:%s")
            WHERE expense_ref = ? `,
            [frequecy, reference]);
        return result;
    },


    getRecurringExpeFilter: async ({ filter_value }: Vendor) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.EXPENSES} WHERE reference = '${filter_value}' `);
        return result;
    },

    updateCustomerAll: async ({ client_id, customer_type, title, first_name, other_name, msisdn, email, company_name, vendor_display_name, website, customer_id }: Vendor) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET 
        client_id=?, customer_type=?, title=?, first_name =?, other_name =?, msisdn=?, email =?, company_name=?, vendor_display_name=?, website=?
        WHERE id = ?
        `, [
            client_id,
            customer_type,
            title,
            first_name,
            other_name,
            msisdn,
            email,
            company_name,
            vendor_display_name,
            website,
            customer_id
        ]);
        return query;
    },

    getCustomerMore: async ({ customer_id }: Vendor) => {
        const query = await client.query(`SELECT * FROM ${TABLE.CUSTOMER_MORE} WHERE customer_id = ?`, [customer_id]);
        return query;
    },

    // updateCustomerMore: async ({
    //     customer_id, street, city_town, state_province, country,
    //     street1, tax_info,
    //     notes, delivery_method, terms, out_of_balance
    // }: Vendor) => {
    //     const query = await client.query(`UPDATE ${TABLE.CUSTOMER_MORE} SET 
    //       street=?, 
    //       city_town=?,
    //       state_province=?, 
    //       country=?,
    //       tax_info=?,
    //       notes=?,
    //       delivery_method=?, 
    //       terms=?, 
    //       out_of_balance=?
    //       WHERE customer_id=?`,
    //         [
    //             street,
    //             city_town,
    //             state_province,
    //             country,
    //             tax_info,
    //             notes,
    //             delivery_method,
    //             terms,
    //             out_of_balance,
    //             customer_id
    //         ]);
    //     return query;
    // },

    getVendorFilter: async ({ filter_value }: Vendor) => {
        const result = await client.query(
            `SELECT * FROM  ${TABLE.VENDORS} WHERE id =?`, [filter_value]);
        return result;
    },
    getPageSizeVendor: async ({ client_id }: Vendor) => {
        const [result] = await client.query(
            `SELECT COUNT(id) count FROM  ${TABLE.VENDORS} WHERE client_id = ?`, [client_id]);
        return result.count;
    },
    updateCustomer: async ({ customer_id }: Vendor) => {
        const query = await client.query(`UPDATE ${TABLE.CUSTOMER} SET status = 1 WHERE id = ? `, [customer_id]);
        return query;
    },


    vendorDelete: async ({ id }: Vendor) => {
        const query = await client.query(`DELETE FROM  ${TABLE.VENDORS}
        WHERE id = ?`, [id]);
        return query;
    },



    updatefrequencyexpensestatus: async ({ expense_ref }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            status = 0
            WHERE expense_ref = ?`,
            [expense_ref]);
        return result;
    },


    updatefrequencyexpensestatus2: async ({ expense_ref }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            status = 1
            WHERE expense_ref = ?`,
            [expense_ref]);
        return result;
    },


    updatefrequencyexpensefrequency: async ({ frequecy, frequency_type, expense_ref }: Vendor) => {
        const result = await client.query(
            `UPDATE ${TABLE.RECURRING_EXPENSE} SET 
            status = 1,
            frequecy = ?,
            frequency_type = ?
            WHERE expense_ref = ?`,
            [frequecy, frequency_type, expense_ref]);
        return result;
    },



   

};