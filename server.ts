import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

import invoiceService from "./services/invoiceService.ts ";

import expenseService from "./services/vendorService.ts";

import { cron, start, monthly, stop, everyMinute, daily, weekly } from 'https://deno.land/x/deno_cron/cron.ts';
const app = new Application();
const router = new Router()
const port: number = 8088;
app.use(
  oakCors({
    origin: "*",
    maxAge: 8640033
  }),
);

let task = everyMinute(async () => {
  stop()
  const invoice_no = await invoiceService.getfrequency();

  if (invoice_no) {

    console.log(invoice_no)

    const data = await invoiceService.getInvoiceFilter({
      filter_value: invoice_no.invoice_no,
      startDate: "2019-03-03 00:00:00",
      endDate: "2011-04-25 23:59:59",
      created_by: invoice_no.created_by
    });



    if (data.length > 0) {
      console.log("here", data)

      const itemData = await invoiceService.getInvoiceItems({
        filter_value: invoice_no.invoice_no,
        created_by: invoice_no.created_by

      });
      // console.log(data)


      // deno-lint-ignore camelcase

      // deno-lint-ignore no-unused-vars
      let mfrequency;


      if (invoice_no.frequency_type === "Daily") {
        mfrequency = ((Date.now() / 1000) + (1 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "Weekly") {
        mfrequency = ((Date.now() / 1000) + (7 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "After 2 Weeks") {
        mfrequency = ((Date.now() / 1000) + (14 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "Monthly") {
        mfrequency = ((Date.now() / 1000) + (30 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "After 2 Months") {
        mfrequency = ((Date.now() / 1000) + (60 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "After 3 Months") {
        mfrequency = ((Date.now() / 1000) + (90 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "After 6 Months") {
        mfrequency = ((Date.now() / 1000) + (180 * 24 * 60 * 60))
      }
      else if (invoice_no.frequency_type === "Yearly") {
        mfrequency = ((Date.now() / 1000) + (365 * 24 * 60 * 60))
      }
      else {
        mfrequency = ((Date.now() / 1000) + (730 * 24 * 60 * 60))
      }



      const weekly = moment(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 15))).format('YYYY-MM-DD HH:mm:ss');
      const monthly = moment(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 30))).format('YYYY-MM-DD HH:mm:ss');
      const yearly = moment(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 133))).format('YYYY-MM-DD HH:mm:ss');

      let mdue_date;

      console.log("here", data[0])

      if (data[0].terms === "Due in 15 days") {
        mdue_date = weekly.toString()
        console.log(weekly)
      }
      else if (data[0].terms === "Due in 30 days") {
        mdue_date = monthly.toString()
      }
      else if (data[0].terms === "Due in 6 months") {
        mdue_date = yearly.toString()
      }
      else {

        mdue_date = (moment(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss')).toString()
      }

      try {

        const body222 = await invoiceService.createInvoice(
          {

            customer_id: data[0].customer_id,
            invoice_no: data[0].invoice_no,
            terms: data[0].terms,
            due_date: mdue_date,
            invoice_date: (moment.unix(Date.now() / 1000).format('YYYY-MM-DD HH:mm:ss')).toString(),
            message_invoice: data[0].message_invoice,
            statement_invoice: data[0].statement_invoice,
            amount: data[0].amount,
            reference: data[0].reference,
            sales_person_id: data[0].sales_person_id,
            agnaist_ksh: data[0].agnist_ksh,
            currency_type: data[0].currency_type,
            estimate: data[0].estimate,
            due_amount: data[0].amount,
            discount_amount: data[0].discount_amount,
            sales_order_no: data[0].sales_order_no,
            sub_total: data[0].sub_total,
            tax_amount: data[0].tax_amount,
            tax_exclusive: data[0].tax_exclusive,
            approved: data[0].approved,
            created_by: data[0].created_by,
            recurring: data[0].recurring
          }
        );

        if (body222) {

          let page_number = "1"
          const offset = (Number(page_number) - 1) * 2;
          const dataInvoice = await invoiceService.getInvoices({
            offset: offset,
            estimate: "0",
            page_size: Number("100"),
            created_by: data[0].created_by,
            startDate: `"${"2020-01-10 00:00:00"}"`,
            sales_order_no: "0",
            endDate: `"${"2023-01-10 00:00:00"}"`
          });

          // let innvoiceNo = { invoice_no: dataInvoice[0].invoice_no };
          let data3 = [];


          for (let i = 0; i < itemData.length; i++) {
            let innvoiceNo = { invoice_no2: dataInvoice[0].invoice_no };
            // let innvoiceNo = { invoice_no2: dataInvoice[0].invoice_no };
            data3.push(Object.assign(innvoiceNo, itemData[i]));
          }
          // console.log(data3)
          const postRequest = await fetch('https://www.peakbooks.biz:9000/insightphp/recurring_invoice.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data3),
          })

          if (postRequest) {

            if (invoice_no.frequency_type === "Daily") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (1 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
                console.log('Done')
              }
            }
            else if (invoice_no.frequency_type === "Weekly") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (7 * 24 * 60 * 60)).toString()
              });
              if (updateData) {
                start();
              }
            }
            else if (invoice_no.frequency_type === "After 2 Weeks") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (14 * 24 * 60 * 60)).toString()
              });
              if (updateData) {
                start();
              }
            }
            else if (invoice_no.frequency_type === "Monthly") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (32 * 24 * 60 * 60)).toString()
              });
              if (updateData) {
                start();
                // console.log(invoice_no)
              }
            }
            else if (invoice_no.frequency_type === "After 2 Months") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (60 * 24 * 60 * 60)).toString()
              });
              if (updateData) {
                start();
                console.log('Done')
              }
            }
            else if (invoice_no.frequency_type === "After 3 Months") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (90 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (invoice_no.frequency_type === "After 6 Months") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (180 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (invoice_no.frequency_type === "Yearly") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (365 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (invoice_no.frequency_type === "After 2 Years") {
              const updateData = await invoiceService.updatefrequency({
                invoice_no: invoice_no.invoice_no,
                frequecy: ((Date.now() / 1000) + (730 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            // start()
          }
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("No Data")

      await invoiceService.updateInvoiceStatus({
        id: invoice_no[0].id
      })
    }



  } else {

    const recur_expense = await expenseService.getfrequencyExpense();
    if (recur_expense) {
      console.log(recur_expense)

      const data = await expenseService.getRecurringExpeFilter({
        filter_value: recur_expense.expense_ref,
      });


      if (data.length > 0) {
        console.log(recur_expense.expense_ref)

        try {
          const submitedexpense = await expenseService.createExpense(
            {
              client_id: data[0].client_id,
              date: (moment.unix(Date.now() / 1000).format('YYYY-MM-DD HH:mm:ss')).toString(),
              expense_account: data[0].expense_account,
              amount: data[0].amount,
              paid_through: data[0].paid_through,
              vendor_id: data[0].vendor_id,
              notes: data[0].notes,
              billable: data[0].billable,
              tax_amount: data[0].tax_amount,
              product_name: data[0].product_name,
              recurring: data[0].recurring,
              customer_id: data[0].customer_id,

            }
          );
          if (submitedexpense) {
            // console.log(data3)
            if (recur_expense.frequency_type === "Daily") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (1 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
                console.log('Done')
              }
            }
            else if (recur_expense.frequency_type === "Weekly") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (7 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (recur_expense.frequency_type === "After 2 Weeks") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (14 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
                console.log('hoorei!!!')
              }
            }
            else if (recur_expense.frequency_type === "Monthly") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (30 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (recur_expense.frequency_type === "After 2 Months") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (60 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (recur_expense.frequency_type === "After 3 Months") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (90 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (recur_expense.frequency_type === "After 6 Months") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (180 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (recur_expense.frequency_type === "Yearly") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (365 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            else if (recur_expense.frequency_type === "After 2 Years") {
              const updateData = await expenseService.updatefrequencyExpenses({
                reference: recur_expense.expense_ref,
                frequecy: ((Date.now() / 1000) + (730 * 24 * 60 * 60)).toString(),
              });
              if (updateData) {
                start();
              }
            }
            // start()
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        await expenseService.deleteExpenseRecurring({
          filter_value: recur_expense.id,
        });
      }
    } else {

      const item = await invoiceService.getItems();

      if (item > 0) {
        // const data = await invoiceService.updateItemsStatus({
        //   status: 0,
        //   id: item[0].id,
        // })
        // console.log("done")
      } else {
        start()
      }
      // console.log("")
    }

  }
});



let task_two = monthly(async () => {

  const invoice_no = await invoiceService.getfreqmonthly();

  if (invoice_no.length > 0) {


    for (let i = 0; i < invoice_no.length; i++) { // for loop for invoices

      const data = await invoiceService.getInvoiceFilter({
        filter_value: invoice_no[i].invoice_no,
        startDate: "2019-03-03 00:00:00",
        endDate: "2011-04-25 23:59:59",
        created_by: invoice_no[i].created_by
      });
      if (data.length > 0) {

        const itemData = await invoiceService.getInvoiceItems({
          filter_value: invoice_no[i].invoice_no,
          created_by: invoice_no[i].created_by

        });
        // deno-lint-ignore no-unused-vars

        const weekly = moment(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 15))).format('YYYY-MM-DD HH:mm:ss');
        const monthly = moment(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 30))).format('YYYY-MM-DD HH:mm:ss');
        const yearly = moment(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 133))).format('YYYY-MM-DD HH:mm:ss');

        let mdue_date;

        console.log("here", data[0])

        if (data[0].terms === "Due in 15 days") {
          mdue_date = weekly.toString()
          console.log(weekly)
        }
        else if (data[0].terms === "Due in 30 days") {
          mdue_date = monthly.toString()
        }
        else if (data[0].terms === "Due in 6 months") {
          mdue_date = yearly.toString()
        }
        else {

          mdue_date = (moment(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss')).toString()
        }

        try {

          const body222 = await invoiceService.createInvoice(
            {

              customer_id: data[0].customer_id,
              invoice_no: data[0].invoice_no,
              terms: data[0].terms,
              due_date: mdue_date,
              invoice_date: (moment.unix(Date.now() / 1000).format('YYYY-MM-DD HH:mm:ss')).toString(),
              message_invoice: data[0].message_invoice,
              statement_invoice: data[0].statement_invoice,
              amount: data[0].amount,
              reference: data[0].reference,
              sales_person_id: data[0].sales_person_id,
              agnaist_ksh: data[0].agnist_ksh,
              currency_type: data[0].currency_type,
              estimate: data[0].estimate,
              due_amount: data[0].amount,
              discount_amount: data[0].discount_amount,
              sales_order_no: data[0].sales_order_no,
              sub_total: data[0].sub_total,
              tax_amount: data[0].tax_amount,
              tax_exclusive: data[0].tax_exclusive,
              approved: data[0].approved,
              created_by: data[0].created_by,
              recurring: data[0].recurring
            }
          );
          if (body222) {
            let page_number = "1"
            const offset = (Number(page_number) - 1) * 2;
            const dataInvoice = await invoiceService.getInvoices({
              offset: offset,
              estimate: "0",
              page_size: Number("100"),
              created_by: data[0].created_by,
              startDate: `"${"2020-01-10 00:00:00"}"`,
              sales_order_no: "0",
              endDate: `"${"2023-01-10 00:00:00"}"`
            });

            // let innvoiceNo = { invoice_no: dataInvoice[0].invoice_no };
            let data3 = [];
            for (let i = 0; i < itemData.length; i++) {
              let innvoiceNo = { invoice_no2: dataInvoice[0].invoice_no };
              // let innvoiceNo = { invoice_no2: dataInvoice[0].invoice_no };
              data3.push(Object.assign(innvoiceNo, itemData[i]));
            }
            // console.log(data3)
            const postRequest = await fetch('https://www.peakbooks.biz:9000/insightphp/recurring_invoice.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data3),
            })

            if (postRequest) {
              const updateData = await invoiceService.updateChecked({
                invoice_no: invoice_no[i].invoice_no,
                frequecy: ((Date.now() / 1000) + ((parseInt(invoice_no[i].days) + 1) * 24 * 60 * 60)).toString()
              });
              if (updateData) {
                start();
                // console.log(invoice_no)
              }
              // start()
            }
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log("No Data")
        await invoiceService.updateInvoiceStatus({
          id: invoice_no[0].id
        })
      }
    }
  }
}, 1);


app.addEventListener("error", (evt) => {
  console.log(evt.error);
});
app.use((ctx) => {
  ctx.throw(500);
});

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(`${yellow("Listening on:")} ${green(url)}`,);
});
await app.listen({ port });
