<?php
header("Access-Control-Allow-Origin: *");   
header("Content-Type: application/json; charset=UTF-8");    
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");    
header("Access-Control-Max-Age: 3600");    
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");    

require('Requests/library/Requests.php');
Requests::register_autoloader();
$headers = array(
	'Authorization' => 'Bearer A21AAJOhb8IkHy549In2-ehuy61WmInaEcphDkYb2weHEx2JJAziywIrrlnfn3qXFVhOuQ01oBb4SsDjweO4GvtYs889c9J0A'
);
$data = '{ "intent": "CAPTURE",
"purchase_units": [{
	"amount": {
		"currency_code": "USD",
		"value": "100.00"
	}   
} 
]
}';
$response = Requests::post('https://api.sandbox.paypal.com/v2/checkout/orders', $headers, $data);


if($response){
	http_response_code(200);
	echo json_encode(
		array(
			"status" => true,
			"message" =>$response)
	);
                # code...
}else{
	echo json_encode(
		array(
			"status" => false,
			"message" => "Error description: " . mysqli_error($con),
		)
	);
}




{
	"status": true,
	"message": {
		"body": "{\"scope\":\"https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/vault/payment-tokens/read https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller Braintree:Vault https://uri.paypal.com/services/payments/refund https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://uri.paypal.com/services/vault/payment-tokens/readwrite https://api.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks\",\"access_token\":\"A21AAJBk5gMm_TaW9kDwRLW2mRMa5PHM0LT1YRvF0gMgxLcc-uYy2Ekju0HPqStZ8w10fvVRpGt14uV_D5RyFgJ4FwzXALRPA\",\"token_type\":\"Bearer\",\"app_id\":\"APP-80W284485P519543T\",\"expires_in\":31859,\"nonce\":\"2020-12-24T15:06:49ZYeq79QFIhLD-it_vbD-oTPFjOOEhwQ3lYaV9t4wunuQ\"}",
		"raw": "HTTP/1.1 200 OK\r\nCache-Control: max-age=0, no-cache, no-store, must-revalidate\r\nContent-Type: application/json\r\nPaypal-Debug-Id: 14e9f1aa5a0d0\r\nX-Paypal-Token-Service: IAAS\r\nVary: Accept-Encoding\r\nContent-Encoding: gzip\r\nDate: Thu, 24 Dec 2020 15:15:50 GMT\r\nContent-Length: 457\r\nConnection: close\r\n\r\n{\"scope\":\"https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/vault/payment-tokens/read https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller Braintree:Vault https://uri.paypal.com/services/payments/refund https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://uri.paypal.com/services/vault/payment-tokens/readwrite https://api.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks\",\"access_token\":\"A21AAJBk5gMm_TaW9kDwRLW2mRMa5PHM0LT1YRvF0gMgxLcc-uYy2Ekju0HPqStZ8w10fvVRpGt14uV_D5RyFgJ4FwzXALRPA\",\"token_type\":\"Bearer\",\"app_id\":\"APP-80W284485P519543T\",\"expires_in\":31859,\"nonce\":\"2020-12-24T15:06:49ZYeq79QFIhLD-it_vbD-oTPFjOOEhwQ3lYaV9t4wunuQ\"}",
		"headers": {},
		"status_code": 200,
		"protocol_version": 1.1,
		"success": true,
		"redirects": 0,
		"url": "https://api-m.sandbox.paypal.com/v1/oauth2/token",
		"history": [],
		"cookies": {}
	}
}





<?php
header("Access-Control-Allow-Origin: *");   
header("Content-Type: application/json; charset=UTF-8");    
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");    
header("Access-Control-Max-Age: 3600");    
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");    

require('Requests/library/Requests.php');

Requests::register_autoloader();
$headers = array(
	'Accept' => 'application/json; charset=UTF-8',
	'Accept-Language' => 'en_US',
	'Access-Control-Allow-Origin'=> '*',
	'Access-Control-Max-Age'=>'3600',
	'Access-Control-Allow-Headers'=>'Origin, X-Requested-With, Content-Type, Accept, Authorization'


);
$data = array(
	'grant_type' => 'client_credentials'
);
$options = array('auth' => array('AdGGSlbySyGgIVPsqY-k_OSOB03lCEzUjfhNFbFJWpKOIrZb3HCG8PmP-3Q20nVyh6TSj8S7XTBJXgA1', 'ECUSfauoWEkkVNbfPVZ65qBHHTBpb4Ua-wFQ6qJ8IL4zZenw8P9a-I6eTRVZQqmVXtHgbpKQ8NQ2q3eo'));
$response = Requests::post('https://api-m.sandbox.paypal.com/v1/oauth2/token', $headers, $data, $options);


if($response){
	http_response_code(200);
	echo json_encode(
		array(
			$response
		)
	);
                # code...
}else{
	echo json_encode(
		array(
			"status" => false,
			"message" => "Error description: " . mysqli_error($con),
		)
	);
}