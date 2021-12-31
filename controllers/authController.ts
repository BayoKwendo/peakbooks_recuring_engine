import { getQuery } from 'https://deno.land/x/oak/helpers.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import userService from '../services/userService.ts';
import { create, getNumericDate } from 'https://deno.land/x/djwt/mod.ts';
// import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt@v0.9.0/create.ts";
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';
import { key } from '../exports.ts'
import axiod from 'https://deno.land/x/axiod/mod.ts';
import { SMS, CONFIG, SMS_BaseUrl, SMS_BaseUrl_2 } from "../db/config.ts";



// const header: Jose = ;

export default {
	/**
   * @description Get all Employee List
   */
	loginUser: async (ctx: any) => {
		const body = await ctx.request.body();
		if (!ctx.request.hasBody) {
			ctx.response.status = 400;
			ctx.response.body = {
				status: false,
				message: 'No data provided',
			};
			return;
		}
		try {
			const values = await body.value;
			const hashedPassword = await bcrypt.hash(values.password);

			const isAvailable = await userService.loginUser({ username: values.username });
			if (!isAvailable) {
				ctx.response.status = 404;
				ctx.response.body = {
					status: false,
					status_code: 400,
					message: 'Invalid Username or Password',
				};
				return;
			} else {
				const result = await bcrypt.compare(values.password, isAvailable.password);
				if (result) {
					const checkActive = await userService.checkActive({
						username: values.username,
					});
					if (!checkActive) {
						ctx.response.status = 400;
						ctx.response.body = {
							status: false,
							status_code: 400,
							message: 'Your Account is not activated!! Contact Administrators',
						};
						return;
					} else {
						const data = {
							first_name: isAvailable.first_name,
							last_name: isAvailable.last_name,
							msisdn: isAvailable.msisdn,
							email: isAvailable.email,
							username: isAvailable.username,
							industry: isAvailable.industry,
							currency: isAvailable.currency,
							approval: isAvailable.approval,
							agnaist_ksh: isAvailable.currency_against_kenya,
							role_id: isAvailable.role_id,
							user_id: isAvailable.id,
							paid: isAvailable.paid,
							payment_plan: isAvailable.payment_plan,
							login_status: isAvailable.login_status,
							admin_role: Number(isAvailable.admin_role),
							client_id: Number(isAvailable.client_id),
							first_time: isAvailable.first_time,
							url: isAvailable.url,
							business_pin: isAvailable.business_pin,
							financial_year: isAvailable.financial_year,
							our_client: isAvailable.our_client,
							company_name: isAvailable.company_name,
							postal_address: isAvailable.postal_address,
							inventory: isAvailable.inventory,
							bank: isAvailable.bank,
							sales: isAvailable.sales,
							purchase: isAvailable.purchase,
							investment: isAvailable.investment,
							accountant: isAvailable.accountant,
							reports: isAvailable.reports,
							documents: isAvailable.documents,
							subscription: isAvailable.subscription,
						};

						//3600 one hour
						const oneHour = 86400;
						const jwt = await create(
							{ alg: 'HS512', typ: 'JWT' },
							{ iss: isAvailable.email, exp: getNumericDate(oneHour) },
							key
						);
						ctx.cookies.set('jwt', new Date());
						ctx.response.body = {
							status: true,
							status_code: 200,
							token: jwt,
							user: data,
						};
					}
				} else {
					ctx.response.status = 400;
					ctx.response.body = {
						status: false,
						status_code: 400,
						message: 'Invalid Email or Password',
					};
					return;
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
   * @description Get all Employee List
   */
	createUser: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		const values = await body.value;
		if (!request.hasBody) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'No data provided',
			};
			return;
		}
		if (!values.first_name) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please enter your first name',
			};
			return;
		}
		if (!values.last_name) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please enter your last name',
			};
			return;
		}
		if (!values.msisdn) {
			response.status = 400;
			response.body = {
				success: false,
				message: 'Please enter your phone number',
			};
			return;
		}
		if (!values.email) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please enter your email',
			};
			return;
		}

		if (!values.currency) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please slect your currency',
			};
			return;
		}
		if (!values.username) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please slect your username',
			};
			return;
		}
		if (!values.company_name) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please enter company name',
			};
			return;
		}
		if (!values.industry) {
			response.status = 400;
			response.body = {
				status: false,
				message: 'Please select industry',
			};
			return;
		}
		try {
			const values = await body.value;

			
			const isAvailable1 = await userService.usernameExist({ username: values.username });

			console.log("vv",isAvailable1);
			
			const phoneIsAvailable = await userService.userExist({
				email: values.email,
				admin_role: values.admin_role,
				client_id: values.client_id
			});

			console.log(JSON.stringify({
				email: values.email,
				admin_role: values.admin_role,
			}) + phoneIsAvailable);

			let checkClientIDExistWithEmail;

			if (values.client_id !== null) {
				checkClientIDExistWithEmail = await userService.userClientID({
					email: values.email,
					client_id: values.client_id,
				});
				console.log(values.client_id);
			}

			if (checkClientIDExistWithEmail) {
				response.status = 404;
				response.body = {
					status: false,
					status_code: 400,
					message: 'Error! you can not add user with the same email address twice for the same account',
				};
				return;
			}
			if (isAvailable1) {
				response.status = 404;
				response.body = {
					status: false,
					status_code: 400,
					message: 'Error! Username Exists',
				};
				return;
			}

			if (phoneIsAvailable) {
				response.status = 404;
				response.body = {
					status: false,
					status_code: 400,
					message: 'Error! you can not register with the same email address as an admin',
				};
				return;
			} else {
				const hashedPassword = await bcrypt.hash(values.password);
				const hashedPassword1 = await bcrypt.hash(values.repeat_password);
				const addUserData = await userService.createUser({
					first_name: values.first_name,
					last_name: values.last_name,
					msisdn: values.msisdn,
					username: values.username,
					role_id: values.role_id,
					our_client: values.our_client,
					email: values.email,
					first_time: values.first_time,
					industry: values.industry,
					paid: values.paid,
					subscription: values.subscription,
					password: hashedPassword,
					url: values.url,
					approval: values.approval,
					company_name: values.company_name,
					currency: values.currency,
					admin_role: values.admin_role,
					currency_against_kenya: values.currency_against_kenya,
					postal_address: values.postal_address,
					inventory: values.inventory,
					bank: values.bank,
					sales: values.sales,
					client_id: values.client_id,
					purchase: values.purchase,
					investment: values.investment,
					accountant: values.accountant,
					reports: values.reports,
					documents: values.documents,
				});
				// console.log(addUserData)
				if (addUserData) {
					// if (clientemail) {
					// cookies.set('email_address', values.email);
					response.body = {
						status: true,
						status_code: 200,
						message: 'Created Successfully! Email has been sent',
					};
					// } else {
					//   response.body = {
					//     status: true,
					//     status_code: 200,
					//     message: "Created Successfully! email not send contact the admin",
					//   };
					// }
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
  * @description Get all Employee List
  */
	updateClientUser: async ({ request, response }: { request: any, response: any }) => {
		const body = await request.body();
		try {
			const values = await body.value;

			// const isAvailable1 = await userService.usernameExist({ username: values.username });
			// const phoneIsAvailable = await userService.userExist({
			// 	email: values.email,
			// 	admin_role: values.admin_role,
			// });

			let checkClientIDExistWithEmail;

			// if (values.client_id !== null) {
			// 	checkClientIDExistWithEmail = await userService.userClientID({
			// 		email: values.email,
			// 		client_id: values.client_id,
			// 	});
			// 	console.log(values.client_id);
			// }

			// if (checkClientIDExistWithEmail) {
			// 	response.status = 404;
			// 	response.body = {
			// 		status: false,
			// 		status_code: 400,
			// 		message: 'Error! you can not add user with the same email address twice for the same account',
			// 	};
			// 	return;
			// }
			// if (isAvailable1) {
			// 	response.status = 404;
			// 	response.body = {
			// 		status: false,
			// 		status_code: 400,
			// 		message: 'Error! Username Set Exists',
			// 	};
			// 	return;
			// }
			// if (phoneIsAvailable) {
			// 	response.status = 404;
			// 	response.body = {
			// 		status: false,
			// 		status_code: 400,
			// 		message: 'Error! you can not register with the same email address as an admin',
			// 	};
			// 	return;
			// // } 
			// else {

			console.log({
				first_name: values.first_name,
				last_name: values.last_name,
				msisdn: values.msisdn,
				username: values.username,
				email: values.email,
				first_time: values.first_time,
				url: values.url,
				industry: values.industry,
				subscription: values.subscription,
				company_name: values.company_name,
				currency: values.currency,
				admin_role: values.admin_role,
				currency_against_kenya: values.currency_against_kenya,
				inventory: values.inventory,
				bank: values.bank,
				approval: values.approval,
				sales: values.sales,
				purchase: values.purchase,
				investment: values.investment,
				accountant: values.accountant,
				reports: values.reports,
				documents: values.documents,
				id: values.id
			})
			const updateUserData = await userService.updateCLientUser({
				first_name: values.first_name,
				last_name: values.last_name,
				msisdn: values.msisdn,
				username: values.username,
				email: values.email,
				first_time: values.first_time,
				url: values.url,
				industry: values.industry,
				subscription: values.subscription,
				company_name: values.company_name,
				currency: values.currency,
				admin_role: values.admin_role,
				currency_against_kenya: values.currency_against_kenya,
				inventory: values.inventory,
				bank: values.bank,
				approval: values.approval,
				sales: values.sales,
				purchase: values.purchase,
				investment: values.investment,
				accountant: values.accountant,
				reports: values.reports,
				documents: values.documents,
				id: values.id
			});

			if (updateUserData) {
				response.body = {
					status: true,
					status_code: 200,
					message: 'User has been updated Successfully!',
				};
			}
			// }
		} catch (error) {
			response.status = 400;
			response.body = {
				status: false,
				message: `${error}`,
			};
		}
	},

	activateAccount: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			const isAvailable = await userService.activateAccountsize({ id: params.id });
			if (isAvailable > 0) {
				for (let i = 0; i < isAvailable; i++) {
					if (isAvailable) {
						const data = await userService.activateAccount({ id: params.id });
						if (data) {
							response.status = 200;
							response.body = {
								status: true,
								status_code: 200,
								message: 'Client Account has been activated',
							};
						}
					}
				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	activateAccountUser: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			const data = await userService.activateAccountUser({ id: params.id });
			if (data) {
				response.status = 200;
				response.body = {
					status: true,
					status_code: 200,
					message: 'User Account has been activated',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	deactiveAccountUser: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			const data = await userService.deactiveAccountUser({ id: params.id });
			if (data) {
				response.status = 200;
				response.body = {
					status: true,
					status_code: 200,
					message: 'User Account has been deactivated',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	// delete user acco

	deleteAccount: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			console.log(params.id);
			const data = await userService.deleteAccount({ id: params.id });
			if (data.affectedRows > 0) {
				response.status = 200;
				response.body = {
					status: true,
					status_code: 200,
					message: 'Account has been deleted',
				};
			} else {
				response.status = 201;
				response.body = {
					status: true,
					status_code: 200,
					message: 'Error deleting the account',
				};
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	deactiveAccount: async ({ params, response }: { params: { id: string }, response: any }) => {
		try {
			const isAvailable = await userService.deactiveAccountsize({ id: params.id });
			if (isAvailable > 0) {
				for (let i = 0; i < isAvailable; i++) {
					if (isAvailable) {
						const data = await userService.deactiveAccount({ id: params.id });
						if (data) {
							response.status = 200;
							response.body = {
								status: true,
								status_code: 200,
								message: 'Client Account has been deactivated',
							};
						}
					}
				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	updateUserPssword: async ({ request, response }: { request: any, response: any }) => {
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
			const hashedPassword = await bcrypt.hash(values.password);

			await userService.updatePassword({
				username: values.username,
				password: hashedPassword,
				// activation_key: values.activation_key
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'User Password Updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	//update organization profile
	updateUserProfile: async ({ request, response }: { request: any, response: any }) => {
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

			await userService.updateUserCurrency({
				currency: values.currency,
				company_name: values.company_name,
				business_pin: values.business_pin,
				postal_address: values.postal_address,
				financial_year: values.financial_year,
				msisdn: values.msisdn,
				id: values.client_id,
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Currency Updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error}`,
			};
		}
	},

	//update password
	updateUser: async ({ request, response }: { request: any, response: any }) => {
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
			const hashedPassword = await bcrypt.hash(values.password);

			await userService.updateUser({
				email: values.email,
				password: hashedPassword,
				// activation_key: values.activation_key
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'User Updated Successfully',
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
   * @description Get all Clients List
   */
	getClients: async (ctx: any) => {
		try {
			let { page_number, filter_value, page_size, status } = getQuery(ctx, { mergeParams: true });
			if (filter_value == null || filter_value == '') {
				const total = await userService.getPageSizeCLient({
					status: status,
				});

				console.log(page_number, '||| params');

				if (page_number == null) {
					page_number = '1';
					page_size = '50';

					const offset = (Number(page_number) - 1) * 10;
					const data = await userService.getClients({
						offset: Number(offset),
						page_size: Number(page_size),
						status: status,
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * 10;
					const data = await userService.getClients({
						offset: Number(offset),
						page_size: Number(page_size),
						status: status,
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

				const data = await userService.getClientFilter({
					filter_value: filter_value,
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					// total: total,
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
   * @description Get all lost user who never renewed their plans after trial period
   */

	getUserLost: async (ctx: any) => {
		try {
			let { filter_value } = getQuery(ctx, {
				mergeParams: true,
			});
			// sms engine
			if (filter_value = "lost_users") {
				const getNumber = await userService.getForgotUsers()
				for (let i = 0; i < getNumber.length; i++) {
					if (i % 20 === 0) {
						await task(i);
					}

					let formData_m = {
						"msisdn": getNumber[i].phone,
						"text": `Dear ${getNumber[i].first_name},\nThank you for signing up with PeakBooks.\nWe hope you had a great experience with your PeakBooks trial. We welcome you to login at https://www.peakbooks.biz and select the plan that suits your business.\nWe look forward to helping you digitize accounting for your business.\n\nRegards,\nPeakBooks`
					}
					await axiod.post(`${SMS_BaseUrl}`, formData_m, CONFIG);

					console.log(`Task ${i} done!`);
				}
				async function task(i: any) {
					await timer(1000);
					console.log(`Task ${i} done!`);
				}
				function timer(ms: any) {
					return new Promise((res) => setTimeout(res, ms));
				}

			} else if (filter_value = "sms_test") {

				const text_m = `text`;
				let formData_m = {
					"msisdn": "254717629732",
					"text": text_m
				}
				await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG);
				await axiod.post(`${SMS_BaseUrl_2} `, formData_m, CONFIG);
			}
			ctx.response.status = 200;
			ctx.response.body = {
				success: true,
				message: `Success!`,
			};
			// console.log(startDate);
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error} `,
			};
		}
	},
	/**
	* @description Get all Clients Documents List
	*/
	getDocumets: async (ctx: any) => {
		try {
			let { filter_value, created_by, page_number, page_size, startDate, id, endDate } = getQuery(ctx, {
				mergeParams: true,
			});

			console.log(startDate);

			// let { page_number, filter_value, page_size, startDate, endDate, id } = getQuery(ctx, { mergeParams: true });

			if (filter_value == null || filter_value == '') {
				const total = await userService.getPageSizeDocument({
					id: id,
					startDate: startDate,
					endDate: endDate,
				});

				console.log();

				if (page_number == null) {
					page_number = '1';
					page_size = '100';

					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await userService.getDocument({
						offset: Number(offset),
						startDate: startDate,
						endDate: endDate,
						page_size: Number(page_size),
						id: id,
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await userService.getDocument({
						offset: Number(offset),
						page_size: Number(page_size),
						startDate: startDate,
						endDate: endDate,
						id: id,
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

				const data = await userService.getDocumentFilter({
					filter_value: filter_value,
					id: id,
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					// total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error} `,
			};
		}
	},

	/**
  * @description Get mpesa code transactions List
  */
	usermpesacode: async (ctx: any) => {
		try {
			let { client_id } = getQuery(ctx, { mergeParams: true });

			const data = await userService.usermpesacode({
				client_id: Number(client_id),
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
				message: `Error: ${error} `,
			};
		}
	},
	/**
 * @description Get all mpesa transactions List
 */
	getMPESATransaction: async (ctx: any) => {
		try {
			let { page_number, filter_value, id } = getQuery(ctx, { mergeParams: true });
			if (filter_value == null || filter_value == '') {
				const total = await userService.getPageSizeMpesa();
				if (page_number == null) {
					page_number = '1';

					const offset = (Number(page_number) - 1) * 100;
					const data = await userService.getMpesaTransaction({
						offset: Number(offset),
					});
					ctx.response.body = {
						status: true,
						status_code: 200,
						total: total,
						data: data,
					};
				} else {
					const offset = (Number(page_number) - 1) * 100;
					const data = await userService.getMpesaTransaction({
						offset: Number(offset),
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

				const data = await userService.getMpesaTransactionFilter({
					filter_value: filter_value,
				});

				ctx.response.body = {
					status: true,
					status_code: 200,
					// total: total,
					data: data,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error} `,
			};
		}
	},


	/**
* @description sendinvoice
*/
	getInvoiceReminder: async ({ request, response }: { request: any, response: any }) => {
		try {

			const body = await request.body();
			const values = await body.value;

			const data = await userService.updateReminder({
				// code: values.code,
				invoice_no: values.invoice_no,
				client_id: values.created_by
			});
			let formData_m = {
				"email": values.customer_email,
				"invoice_no": values.invoice_no,
				"due_date": values.due_date,
				"company_name": values.customer_name,
				"due_amount": values.due_amount,
				"client_email": values.client_email
			}


			console.log("formData_m", formData_m);

			const send = await axiod.post(`https://www.peakbooks.biz:9000/insightphp/sendEmailInvoice.php`, formData_m, CONFIG);
			response.body = {
				status: true,
				status_code: 200,
				message: "success",
			};

			console.log("send", send);
		} catch (error) {
			response.status = 400;
			response.body = {
				success: true,
				message: "success"
			};
		}
	},

	/**
* @description Get all sign in audit trail
*/
	getAuditTrail: async (ctx: any) => {
		try {
			let { client_id } = getQuery(ctx, { mergeParams: true });
			const data = await userService.getAudit({
				client_id: Number(client_id),
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
				message: `Error: ${error} `,
			};
		}
	},

	/**
   * @description Get all Generate opt and send
   */
	optSave: async ({ request, response }: { request: any, response: any }) => {
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
		try {
			const values = await body.value;
			const otpSave = await userService.optsave({
				code: values.code,
				msisdn: values.msisdn,
				expired: values.expired,
			});

			if (otpSave) {
				// console.log(data3)
				let formData_m = {
					"msisdn": values.msisdn.toString(),
					"text": 'Your verification code is \n\n' + values.code.toString() + '\n\n Expire in 2 minutes time'
				}
				await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG);

				response.body = {
					status: true,
					status_code: 200,
					message: 'Success! code has been send',
				};

			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},

	/**
   * @description Get all Generate opt and send
   */
	optSaveOthernumbers: async ({ request, response }: { request: any, response: any }) => {
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
		try {
			const values = await body.value;
			const otpSave = await userService.optsave({
				code: values.code,
				msisdn: '+' + values.msisdn,
				expired: values.expired,
			});

			if (otpSave) {
				const postRequest = await fetch('http://bulksms.mobitechtechnologies.com/api/sendsms', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						api_key: '61c6cc5486c1c',
						username: 'peakbooks',
						sender_id: '23107',
						message:
							'Your verification code is \n\n' + values.code.toString() + '\n\nExpire in 2 minutes time',
						phone: values.msisdn.toString(),
					}),
				});

				console.log(postRequest);

				if (postRequest) {
					response.body = {
						status: true,
						status_code: 200,
						message: 'Success! code has been send',
					};
				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},

	/**
   * @description Get all Generate opt and send VIA EMAIL
   */
	optSaveEmail: async ({ request, response }: { request: any, response: any }) => {
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
		try {
			const values = await body.value;
			const otpSave = await userService.optsave({
				code: values.code,
				msisdn: values.msisdn,
				expired: values.expired,
			});

			if (otpSave) {
				// console.log(data3)
				const postRequest = await fetch('https://www.peakbooks.biz:9000/insightphp/sendotp.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						mreference: values.code.toString(),
						email: values.email.toString(),
					}),
				});

				console.log(postRequest);

				if (postRequest) {
					response.body = {
						status: true,
						status_code: 200,
						message: 'Success! code has been send',
					};
				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},

	verifyCode: async (ctx: any) => {
		try {
			const body = await ctx.request.body();
			const values = await body.value;

			const total = await userService.getOTP({
				code: values.code,
				msisdn: values.msisdn,
			});

			if (total > 0) {
				const data = await userService.updateVerify({
					code: values.code,
					msisdn: values.msisdn,
					client_id: values.client_id,
					login_expiry: values.login_expiry,
				});
				console.log(total);
				ctx.response.body = {
					status: true,
					message: 'Verified! Redirecting',
					status_code: 200,
				};
			} else {
				ctx.response.body = {
					status: false,
					message: 'Invalid code',
					status_code: 200,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error} `,
			};
		}
	},

	mpesaUpdate: async (ctx: any) => {
		try {
			const body = await ctx.request.body();
			const values = await body.value;

			const data = await userService.updateMPESA({
				payment_status: values.payment_status,
				subscription: values.subscription,
				client_id: values.client_id,
				amount_paid: Number(values.amount),
				mpesa_code: values.mpesa_code,
			});

			console.log({
				payment_status: values.payment_status,
				subscription: values.subscription,
				client_id: values.client_id,
				amount_paid: Number(values.amount),
				mpesa_code: values.mpesa_code,
			});

			console.log(data.affectedRows);

			if (data.affectedRows > 0) {

				let formData_m = {
					"msisdn": values.msisdn.toString(),
					"text": 'Dear ' + values.name + '\n\nThis is to confirm that your subscription to ' + values.plan_type + ' plan was succesfully.\n\nYour plan is due on ' + values.subscription,
				}
				await axiod.post(`${SMS_BaseUrl} `, formData_m, CONFIG);

				const postRequest = await fetch(
					'https://www.peakbooks.biz:9000/insightphp/peakBooksEmailPaymentAcknowledgemnt.php',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							company_name: values.name,
							email: values.email,
							subscription: values.subscription,
						}),
					}
				);
				if (postRequest) {
					ctx.response.body = {
						status: true,
						status_code: 200,
						message: 'SUCCESS!!',
					};
				} else {
					ctx.response.body = {
						status: true,
						status_code: 200,
						message: 'SUCCESS!!',
					};
				}

			} else {
				ctx.response.body = {
					status: false,
					message: 'Error! contact the administrator!',
					status_code: 200,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},

	mpesaUpdateOtherNo: async (ctx: any) => {
		try {
			const body = await ctx.request.body();
			const values = await body.value;

			const data = await userService.updateMPESA({
				payment_status: values.payment_status,
				subscription: values.subscription,
				client_id: values.client_id,
				amount_paid: Number(values.amount),
				mpesa_code: values.mpesa_code,
			});

			console.log({
				payment_status: values.payment_status,
				subscription: values.subscription,
				client_id: values.client_id,
				amount_paid: Number(values.amount),
				mpesa_code: values.mpesa_code,
			});

			if (data.affectedRows > 0) {
				const postRequest = await fetch('http://bulksms.mobitechtechnologies.com/api/sendsms', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						api_key: '61c6cc5486c1c',
						username: 'peakbooks',
						sender_id: '23107',
						message:
							'Dear ' +
							values.name +
							'\n\nThis is to confirm that your subscription to ' +
							values.plan_type +
							' plan was succesfully. \n\nYour plan is due on ' +
							values.subscription,
						phone: values.msisdn.toString(),
					}),
				});
				if (postRequest) {
					const postRequest = await fetch(
						'https://www.peakbooks.biz:9000/insightphp/peakBooksEmailPaymentAcknowledgemnt.php',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								company_name: values.name,
								email: values.email,
								subscription: values.subscription,
							}),
						}
					);
					if (postRequest) {
						ctx.response.body = {
							status: true,
							status_code: 200,
							message: 'SUCCESS!!',
						};
					} else {
						ctx.response.body = {
							status: true,
							status_code: 200,
							message: 'SUCCESS!!',
						};
					}
				}
			} else {
				ctx.response.body = {
					status: false,
					message: 'Something went wrong. Try Again',
					status_code: 200,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error} `,
			};
		}
	},

	//get All SMS
	getSMS: async (ctx: any) => {
		try {
			// let kw = request.url.searchParams.get('page_number');
			let { page_number, page_size, filter_value } = getQuery(ctx, { mergeParams: true });
			const total = await userService.getSMSCount();
			// console.log(total)
			if (filter_value == null || filter_value == '') {
				if (page_number == null) {
					page_number = '1';
					page_size = '100';
					const offset = (Number(page_number) - 1) * Number(page_size);
					const data = await userService.getSMSLog({
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
					const data = await userService.getSMSLog({
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
			} else {
				// console.log(filter_value, '||| params');
				const data = await userService.getSMSFilter({ filter_value: filter_value });
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
				message: `${error}`,
			};
		}
	},


	/**
   * @description Get all Generate opt and send
   */
	getPasswordReset: async ({ request, response }: { request: any, response: any }) => {
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
		try {
			const values = await body.value;
			const isAvailable = await userService.loginUser({ username: values.username });
			if (!isAvailable) {
				response.status = 404;
				response.body = {
					status: false,
					status_code: 400,
					message: 'Reset instructions have been sent to your email',
				};
				return;
			} else {
				// console.log(isAvailable.email)
				const postRequest = await fetch('https://www.peakbooks.biz:9000/insightphp/reset_password.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: isAvailable.email.toString(),
						username: values.username
					}),
				});
				console.log(postRequest);
				if (postRequest) {
					response.body = {
						status: true,
						status_code: 200,
						message: 'Reset instructions have been sent to your email',
					};
				}
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},


	getUsernames: async ({ request, response }: { request: any, response: any }) => {
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
			// console.log(values);
			const isAvailable = await userService.getUsernames({ email: values.email });
			if (!isAvailable) {
				response.status = 404;
				response.body = {
					status: false,
					status_code: 400,
					message: 'Email not found',
				};
				return;
			} else {
				const formatData = {
					email: values.email.toString(),
					username: isAvailable
				}
				await axiod
					.post('https://www.peakbooks.biz:9000/insightphp/sendUsernameReminder.php', formatData, {
						headers: {
							'Content-Type': 'application/json'
						},
					})
					.then((resonse) => {

						console.log(resonse);
						response.body = {
							status: true,
							status_code: 200,
							message: 'Reset instructions have been sent to your email'
						};
					}
					).catch((error) => {
						console.log(error);
					})

				// const postRequest = await fetch('', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 	},
				// 	,
				// });
				// console.log(postRequest);
				// if (postRequest) {
				// 	response.body = {
				// 		status: true,
				// 		status_code: 200,
				// 		message: 'Reset instructions have been sent to your email',
				// 	};
				// }
			}
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},

	confirmResetCode: async (ctx: any) => {
		try {
			const body = await ctx.request.body();
			const values = await body.value;

			const total = await userService.getResetOTP({
				code: values.code,
				email: values.email,
			});

			if (total > 0) {
				const data = await userService.updatePasswordReset({
					code: values.code,
					email: values.email,
				});
				console.log(total);
				ctx.response.body = {
					status: true,
					message: 'Verified! Redirecting',
					status_code: 200,
				};
			} else {
				ctx.response.body = {
					status: false,
					message: 'Invalid code',
					status_code: 200,
				};
			}
		} catch (error) {
			ctx.response.status = 400;
			ctx.response.body = {
				success: false,
				message: `Error: ${error} `,
			};
		}
	},

	/**
   * @description save new password
   */
	savePasswordReset: async ({ request, response }: { request: any, response: any }) => {
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
		try {
			const values = await body.value;
			const hashedPassword = await bcrypt.hash(values.password);

			await userService.resetUserPassword({
				username: values.username,
				password: hashedPassword,
				// activation_key: values.activation_key
			});
			response.body = {
				status: true,
				status_code: 200,
				message: 'Password updated Successfully',
			};
		} catch (error) {
			response.status = 400;
			response.body = {
				success: false,
				message: `${error} `,
			};
		}
	},
};
