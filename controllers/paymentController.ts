import { Client } from 'https://deno.land/x/mysql/mod.ts';
import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import paymentService from '../services/paymentService.ts';

export default {
	/**
   * @description Add a new Item
   */
	createPaymentMethod: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.createPayment({
				name: values.name,
				client_id: values.client_id,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: `${values.name} added successfully to the List`,
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
 * @description Add a new Item
 */
	createCashBank: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.createBankCash({
				account_name: values.account_name,
				account_balance: values.account_balance,
				client_id: values.client_id,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: `${values.account_name} added successfully to the List`,
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
 * @description Add a new Item
 */
	createBank: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.createBank({
				account_name: values.account_name,
				account_type: values.account_type,
				account_code: values.account_code,
				currency: values.currency,
				account_number: values.account_number,
				bank_name: values.bank_name,
				description: values.description,
				account_balance: values.account_balance,
				client_id: values.created_by,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: `${values.account_name} added successfully to the List`,
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},
	/**
   * @description Get all Items List
   */
	getPayments: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, filter_value, page_size, client_id } = getQuery(ctx, {
				mergeParams: true,
			});
			// const total = await itemService.getPageSizeItem({
			//   client_id: Number(client_id),
			// });
			console.log(page_size, '||| params');

			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';

					page_size = '10';

					const offset = (Number(page_number) - 1) * Number(page_size);

					const data = await paymentService.getPayment({
						offset: Number(offset),
						page_size: Number(page_size),
						client_id: Number(client_id),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getPayment({
						offset: Number(offset),
						page_size: Number(page_size),
						client_id: Number(client_id),
					});

					ctx.response.body = {
						status: true,
						status_code: 200,
						// total: total,
						data: data,
					};
				}
			} else {
				console.log(filter_value, '||| params');

				const data = await paymentService.getPaymentFilter({
					filter_value: filter_value,
					client_id: Number(client_id),
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Add a new Item
   */
	createDeposit_to: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.createDeposit_to({
				name: values.name,
				client_id: values.client_id,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: `${values.name} added successfully to the List`,
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Add a expense account
   */
	createExpenseAccount: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.createExpenseAccount({
				name: values.name,
				category: values.category,
				category_type: values.category_type,
				created_by: values.created_by,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: `${values.name} added successful`,
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	// get expense account
	getExpenseAccount: async (ctx: any) => {
		try {
			let { created_by } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getExpenseAccount({
				created_by: Number(created_by),
			});
			ctx.response.body = data;
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all Items List
   */
	getDeposit_to: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, filter_value, page_size, client_id } = getQuery(ctx, {
				mergeParams: true,
			});
			// const total = await itemService.getPageSizeItem({
			//   client_id: Number(client_id),
			// });
			console.log(page_size, '||| params');

			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';

					page_size = '10';

					const offset = (Number(page_number) - 1) * Number(page_size);

					const data = await paymentService.getDeposit_to({
						offset: Number(offset),
						page_size: Number(page_size),
						client_id: Number(client_id),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getDeposit_to({
						offset: Number(offset),
						page_size: Number(page_size),
						client_id: Number(client_id),
					});

					ctx.response.body = {
						status: true,
						status_code: 200,
						// total: total,
						data: data,
					};
				}
			} else {
				console.log(filter_value, '||| params');

				const data = await paymentService.getDeposittoFilter({
					filter_value: filter_value,
					client_id: Number(client_id),
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getCustomerStatements: async (ctx: any) => {
		try {
			let { client_id, startDate, id, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getCustomerStatements({
				created_by: Number(client_id),
				startDate: startDate,
				id: id,
				endDate: endDate,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getBankings: async (ctx: any) => {
		try {
			let { client_id, startDate, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getBanking({
				created_by: Number(client_id),
				startDate: startDate,
				endDate: endDate,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getBankDetails: async (ctx: any) => {
		try {
			let { page_number, filter_v, client_id, page_size } = getQuery(ctx, {
				mergeParams: true,
			});
			const total = await paymentService.getBankDetailsCount({
				created_by: Number(client_id),
				filter_value: filter_v,
			});

			if (page_number == null) {
				page_number = '1';
				page_size = '100';
				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getBankDetails({
					created_by: Number(client_id),
					filter_value: filter_v,
					offset: Number(offset),
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			} else {
				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getBankDetails({
					created_by: Number(client_id),
					filter_value: filter_v,
					offset: Number(offset),
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/* let {
        page_number,
        page_size,
        startDate,
        endDate,
        created_by,
      } = getQuery(ctx, { mergeParams: true });
*
  * @description Bankings
  */
	getBanks: async (ctx: any) => {
		try {
			let { client_id, account_type } = getQuery(ctx, {
				mergeParams: true,
			});

			console.log(account_type);

			const data = await paymentService.getBanks({
				created_by: Number(client_id),
				account_type: account_type,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
  * @description Delete payment received
  */
	deleteDeletePaymentReceived: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { id, customer_id, created_by } = getQuery(ctx, {
				mergeParams: true,
			});
			const data = await paymentService.deletePaymentReceived({
				id: Number(id),
			});
			if (data) {
				const data_length = await paymentService.gerInvoicePaid({
					id: id,
					created_by: Number(created_by),
				});
				const c_data_length = await paymentService.gerCustomerBalance({
					id: id,
				});

				console.log(JSON.stringify(data_length));
				if (data_length.length > 0) {
					for (let i = 0; i < data_length.length; i++) {
						const formatCurrency = (amount: any) => {
							return new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'ABS',
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})
								.format(amount)
								.replaceAll('ABS', data_length[i].currency_type);
						};
						let str = data_length[i].due_amount;
						str = str.toString().replace(/[^\d\.\-]/g, ''); // You might also include + if you want them to be able to type it
						const mbalance = parseFloat(str);
						const newBalance = formatCurrency(mbalance + parseFloat(data_length[i].amount));

						// console.log(customer_id+" "+c_data_length[0].amount)
						// console.log(mbalance + parseFloat(data_length[i].amount))

						if (data_length[i].amount > 0) {
							const data_2 = await paymentService.updateInvoicePaidBInvoice({
								id: id,
								invoice_no: data_length[i].invoice_no,
								client_id: data_length[i].client_id,
								balance_amount: newBalance,
							});

							const data_3 = await paymentService.updateCustomerBalance({
								id: customer_id,
								balance_amount: c_data_length[0].amount,
							});
						}
						ctx.response.body = {
							status: true,
							status_code: 200,
							message: 'Delete successfully',
						};
					}
				} else {
					const data_2 = await paymentService.updateInvoicePaid({
						id: id,
					});
					const data_3 = await paymentService.updateCustomerBalance({
						id: customer_id,
						balance_amount: c_data_length[0].amount,
					});

					if (data_2) {
						ctx.response.body = {
							status: true,
							status_code: 200,
							message: 'Delete successfully',
						};
					}
				}
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Add a new payment received
   */
	createPaymentReceivedPay: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			await paymentService.createPaymentReceived({
				customer_id: values.customer_id,
				invoice_no: values.invoice_no,
				amount_received: values.amount_received,
				payment_date: values.payment_date,
				payment_mode: values.payment_mode,
				reference: values.reference,
				deposit_to: values.deposit_to,
				notes: values.notes,
				amount_inexcess: values.amount_inexcess,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Payment recorded successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description payment received edit
   */
	editBankAmount: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;


			console.log("Bayo", values.account_type)

			if (values.account_type == 'Petty Cash' || values.account_type == 'Undeposited Funds') {
				values.amount_received = 0;
				await paymentService.editPaymentAmountDefault({
					amount_received: values.amount_received,
					created_by: values.created_by,
					account_type: values.account_type,
				});
				response.body = {
					status: true,
					status_code: 200,
					message: 'Success!',
				};
			} else {
				await paymentService.editPaymentAmount({
					amount_received: values.amount_received,
					created_by: values.created_by,
					account_type: values.account_type,
				});
				response.body = {
					status: true,
					status_code: 200,
					message: 'Success!',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description payment received edit
   */
	editPaymentReceivedPay: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			await paymentService.editPaymentReceived({
				customer_id: values.customer_id,
				invoice_no: values.invoice_no,
				amount_received: values.amount_received,
				payment_date: values.payment_date,
				update_amount: values.update_amount,
				payment_mode: values.payment_mode,
				reference: values.reference,
				deposit_to: values.deposit_to,
				notes: values.notes,
				id: values.id,
				amount_inexcess: values.amount_inexcess,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Payment recorded successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Get all id payment rreceived
   */
	getPaymentUnpaidrecord: async (ctx: any) => {
		try {
			let { customer_id } = getQuery(ctx, { mergeParams: true });

			const data = await paymentService.getPaymentUnpaidrecord({
				customer_id: customer_id,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all id payment rreceived
   */
	getPaymentUnpaidrecordbill: async (ctx: any) => {
		try {
			let { vendor_id } = getQuery(ctx, { mergeParams: true });

			const data = await paymentService.getPaymentUnpaidrecordbill({
				vendor_id: vendor_id,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	updatePaymentBillUnpaidrecord: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.updatePaymentBillUnpaidrecord({
				vendor_id: values.vendor_id,
				bill_no: values.bill_no,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Bill Payment was succesfully recorded',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	updatePaymentUnpaidrecord: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.updatePaymentUnpaidrecord({
				customer_id: values.payment_id,
				invoice_no: values.invoice_no,
			});

			console.log(values.payment_id);
			response.body = {
				status: true,
				status_code: 200,
				message: 'Payment was succesfully recorded',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Get all Payment made List
   */
	getPaymentReceivedPaid: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, filter_value, created_by, page_size } = getQuery(ctx, {
				mergeParams: true,
			});
			const total = await paymentService.getPageSizePaymentReceived({
				created_by: Number(created_by),
			});
			if (filter_value == null || filter_value == '') {
				console.log(page_number, '||| params');

				if (page_number == null) {
					page_number = '1';
					page_size = '100';

					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getPaymentReceivedUnpaid({
						offset: Number(offset),
						page_size: Number(page_size),
						created_by: Number(created_by),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getPaymentReceivedUnpaid({
						offset: Number(offset),
						page_size: Number(page_size),
						created_by: Number(created_by),
					});

					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				}
			} else {
				console.log(filter_value, '||| params');

				const data = await paymentService.getReceivedFilter({
					filter_value: filter_value,
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},
	/**
   * @description Get all Payment made List FOR BILLS
   */
	getPaymentReceivedPaidbILLS: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, filter_value, page_size, created_by } = getQuery(ctx, {
				mergeParams: true,
			});
			const total = await paymentService.getPageSizePaymentReceivedBills({
				created_by: Number(created_by),
			});
			console.log(created_by, '||| params');

			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';

					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getPaymentReceivedpaidbills({
						offset: Number(offset),
						created_by: Number(created_by),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getPaymentReceivedpaidbills({
						offset: Number(offset),
						created_by: Number(created_by),
					});

					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				}
			} else {
				console.log(filter_value, '||| params');
				const data = await paymentService.getReceivedFilterBills({
					filter_value: filter_value,
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Add a new bill
   */
	createBill: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		const values = await body.value;
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		if (!values.vendor_id) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'Please select a vendor',
			};
			return;
		}
		try {
			const values = await body.value;
			//
			const body222 = await paymentService.createBill({
				vendor_id: values.vendor_id,
				bill_no: values.bill_no,
				terms: values.terms,
				bill_date: values.bill_date,
				due_date: values.due_date,
				notes: values.notes,
				tax_inclusive: values.tax_inclusive,
				amount: values.amount,
				due_amount: values.due_amount,

				discount_amount: values.discount_amount,
				sub_total: values.sub_total,
				tax_amount: values.tax_amount,
				created_by: values.created_by,
				recurring: values.recurring,
			});

			if (body222) {
				if (values.frequecy == null) {
					response.body = {
						status: true,
						status_code: 200,
						message: 'Bill added successfully',
					};
				} else {
					const recurring_invoices = await paymentService.createRecurringBill({
						bill_no: values.bill_no,
						start_time: values.start_time,
						due_amount: values.due_amount,
						end_time: values.end_time,
						frequecy: values.frequecy,
						frequency_type: values.frequency_type,
						vendor_id: values.vendor_id,
						created_by: values.created_by,
					});

					if (recurring_invoices) {
						response.body = {
							status: true,
							status_code: 200,
							message: 'Recurring Bill added successfully',
						};
					}
				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Get all Payment Reports List
   */
	getPaymentReceivedReports: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, page_size, startDate, endDate, created_by } = getQuery(ctx, { mergeParams: true });

			const total = await paymentService.getPaymentReceivedReportsSize({
				created_by: Number(created_by),
				startDate: startDate,
				endDate: endDate,
			});

			if (page_number == null) {
				page_number = '1';
				page_size = '10';

				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getPaymentReceivedReports({
					offset: Number(offset),
					created_by: Number(created_by),
					startDate: startDate,
					endDate: endDate,
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			} else {
				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getPaymentReceivedReports({
					offset: Number(offset),
					created_by: Number(created_by),
					startDate: startDate,
					endDate: endDate,
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all Payment Made Report List
   */
	getPaymentMadeReports: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, page_size, startDate, endDate, created_by } = getQuery(ctx, { mergeParams: true });

			const total = await paymentService.getPaymentMadeReportsSize({
				created_by: Number(created_by),
				startDate: startDate,
				endDate: endDate,
			});

			if (page_number == null) {
				page_number = '1';
				page_size = '10';

				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getPaymentMadeReports({
					offset: Number(offset),
					created_by: Number(created_by),
					startDate: startDate,
					endDate: endDate,
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			} else {
				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getPaymentMadeReports({
					offset: Number(offset),
					created_by: Number(created_by),
					startDate: startDate,
					endDate: endDate,
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all Invoices List
   */
	getBills: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, filter_value, estimate, page_size, created_by } = getQuery(ctx, { mergeParams: true });
			const total = await paymentService.getPageSizeBill({
				created_by: Number(created_by),
				estimate: estimate,
			});
			if (filter_value == null || filter_value == '') {
				console.log(page_number, '||| params');

				if (page_number == null) {
					page_number = '1';
					page_size = '10';

					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getBill({
						offset: Number(offset),
						estimate: estimate,
						page_size: Number(page_size),
						created_by: Number(created_by),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getBill({
						offset: Number(offset),
						estimate: estimate,
						page_size: Number(page_size),
						created_by: Number(created_by),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				}
			} else {
				console.log(filter_value, '||| params');

				const data = await paymentService.getInvoiceFilter({
					filter_value: filter_value,
					created_by: Number(created_by),
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	//Vendor Aging Report Controller
	getAgingSummaryBills: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, startDate, endDate, created_by } = getQuery(ctx, { mergeParams: true });

			const total = await paymentService.getAgingSummarySizeVendor({
				created_by: Number(created_by),
				startDate: startDate,
				endDate: endDate,
			});

			console.log(total);
			if (page_number == null) {
				page_number = '1';
				page_size = '10';

				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getAgingSummaryBills({
					offset: Number(offset),
					created_by: Number(created_by),
					startDate: startDate,
					endDate: endDate,
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			} else {
				const offset = (Number(page_number) - 1) * Number(page_size);
				const data = await paymentService.getAgingSummaryBills({
					offset: Number(offset),
					created_by: Number(created_by),
					startDate: startDate,
					endDate: endDate,
					page_size: Number(page_size),
				});
				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all bill item list
   */
	getBillItems: async (ctx: any) => {
		try {
			let { filter_value } = getQuery(ctx, { mergeParams: true });
			const data = await paymentService.getBillItems({
				filter_value: filter_value,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all currency lists
   */
	getCurrency: async (ctx: any) => {
		try {
			let { filter_value } = getQuery(ctx, { mergeParams: true });
			const data = await paymentService.getCurrency();
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	// update currecny value
	updateCurrency: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.editCurrency({
				id: values.id,
				filter_value: values.filter_value,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Get all paid bill List
   */
	getBillPaidReceipt: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { filter_value } = getQuery(ctx, { mergeParams: true });

			console.log(filter_value, '||| params');

			const data = await paymentService.getBillFilterPaidReceipt({
				filter_value: filter_value,
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Get all rECURRING Invoices List
   */
	getFrequencyBills: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { page_number, filter_value, page_size, estimate, created_by } = getQuery(ctx, {
				mergeParams: true,
			});
			const total = await paymentService.getPageSizeFrequencyBills({
				created_by: Number(created_by),
				estimate: estimate,
			});
			if (filter_value == null || filter_value == '') {
				console.log(page_number, '||| params');

				if (page_number == null) {
					page_number = '1';

					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getFrequencyBills({
						offset: Number(offset),
						estimate: estimate,
						created_by: Number(created_by),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await paymentService.getFrequencyBills({
						offset: Number(offset),
						estimate: estimate,
						created_by: Number(created_by),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				}
			} else {
				console.log(filter_value, '||| params');

				const data = await paymentService.getFrequencyBillsFilter({
					filter_value: filter_value,
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},
	/**
   * @description Get all unpaid bill List
   */
	getBillUnpaid: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			// console.log("bayo", kw)
			let { filter_value, created_by } = getQuery(ctx, { mergeParams: true });
			const total = await paymentService.getPageSizeBillUnpaid({
				filter_value: filter_value,
				created_by: Number(created_by),
			});

			console.log(filter_value, '||| params');

			const data = await paymentService.getFilterBillsUnpaid({
				filter_value: filter_value,
				created_by: Number(created_by),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				total: total,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	updatefrequencystatus: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.updatefrequencystatus({
				bill_no: values.bill_no,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	updatefrequencystatus2: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			await paymentService.updatefrequencystatus2({
				bill_no: values.bill_no,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	/**
   * @description Get all unpaid bill List
   */
	getBillingsAmount: async (ctx: any) => {
		try {
			let { created_by, startDate, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getBillingsAmount({
				startDate: startDate,
				endDate: endDate,
				created_by: Number(created_by),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getPaymentMadeReportAmount: async (ctx: any) => {
		try {
			let { created_by, startDate, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getPaymentMadeReportAmount({
				startDate: startDate,
				endDate: endDate,
				created_by: Number(created_by),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getPaymentReceivable: async (ctx: any) => {
		try {
			let { created_by, startDate, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getPaymentReceivable({
				startDate: startDate,
				endDate: endDate,
				created_by: Number(created_by),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getPaymentPettyCash: async (ctx: any) => {
		try {
			let { created_by, startDate, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getPaymentPettyCash({
				startDate: startDate,
				endDate: endDate,
				created_by: Number(created_by),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	getPaymentUndeposited: async (ctx: any) => {
		try {
			let { created_by, startDate, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			const data = await paymentService.getPaymentUndeposited({
				startDate: startDate,
				endDate: endDate,
				created_by: Number(created_by),
			});
			ctx.response.body = {
				status: true,
				status_code: 200,
				data: data,
			};
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error}`,
			};
		}
	},

	/**
   * @description Add a new payment received
   */
	createPaymentReceivedBillPay: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;

			await paymentService.createPaymentReceivedBill({
				vendor_id: values.vendor_id,
				bill_no: values.bill_no,
				order_no: values.order_no,
				amount_received: values.amount_received,
				payment_date: values.payment_date,
				payment_mode: values.payment_mode,
				reference: values.reference,
				deposit_to: values.deposit_to,
				notes: values.notes,
				amount_inexcess: values.amount_inexcess,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Payment recorded successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},
};
