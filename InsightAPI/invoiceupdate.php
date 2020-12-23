<?php
// required headers
header("Access-Control-Allow-Origin: *");   
header("Content-Type: application/json; charset=UTF-8");    
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");    
header("Access-Control-Max-Age: 3600");    
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");    

/// get posted data
$data = json_decode(file_get_contents("php://input"), true);
// get jwt
// $jwt=isset($data->jwt) ? $data->jwt : "";
require("db.php"); 
        //set alert values
foreach($data as $d){


  $insertstatement = mysqli_query (
    $con,"UPDATE Invoice_Items 
    set 
    invoice_no = '". $d['invoice_no']."',
    item_id = '".$d['item_id']."', 
    id = '".$d['id']."', 
    name = '".$d['name']."',
    description = '".$d['description']."',
    price = '".$d['price']."',
    tax_percentage = '".$d['tax_percentage']."',
    discount_percentage= '".$d['discount_percentage']."',
    quantity='".$d['quantity']."'

    WHERE id= '".$d['id']."' "  
  );
  if($insertstatement){
   http_response_code(200);
   echo json_encode(
     array(
       "status" => true,
       "message" =>"Invoice has been updated successfully")
     );              # code...
 }else{
   echo json_encode(
     array(
       "status" => false,
       "message" => "Error description: " . mysqli_error($con),
     )
   );
 }
}


?>