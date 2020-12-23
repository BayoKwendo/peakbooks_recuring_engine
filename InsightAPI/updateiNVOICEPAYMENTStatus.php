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
    $con, "UPDATE Invoices 
    set 
    status = 1,
    payment_received_id = '".$d['payment_id']."' 
    WHERE invoice_no= '".$d['invoice_no']."' "  
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