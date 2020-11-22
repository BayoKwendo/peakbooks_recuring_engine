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
    
    $con,"INSERT INTO estimate_items 
    (estimate_no, item_id, name, description, price, quantity)  
    VALUES (
    '".$d['estimate_no']."', 
    '".$d['id']."', 
    '".$d['name']."', 
    '".$d['description']."',
    '".$d['price']."',
    '".$d['quantity']."')");

  if($insertstatement){
   http_response_code(200);
   echo json_encode(
    array(
      "status" => true,
      "message" =>"Estimate has been created successfully")
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

}
// Query. Note the trim to remove the last ,

?>