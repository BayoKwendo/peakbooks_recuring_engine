<?php
// required headers
header("Access-Control-Allow-Origin: *");   
header("Content-Type: application/json; charset=UTF-8");    
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");    
header("Access-Control-Max-Age: 3600");    
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");    

/// get posted data

require 'phpmailer/PHPMailerAutoload.php';

$data = json_decode(file_get_contents("php://input"), true);

$mail = new PHPMailer(true); 
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$mail->IsSMTP(); 
$mail->SMTPAuth = true; 
$mail->SMTPSecure = 'tls'; 
$mail->Host = "smtp.gmail.com";

        $mail->Port = 587; // or 587
        $mail->Username = "bayokwendo@gmail.com";
        $mail->Password = "omulama96";

        $mail->setFrom('admin@insightpeak.com', 'PeakInsight');
        //$to =   $this->email ;
        
        $to = $data['email'];
        $mail->addAddress($to);
        $mail->Subject = 'PeakInsight Invoice';
        $mail->addStringAttachment(base64_decode($data['filesend']), 'Invoice.pdf');
        $message = 'heegg' ; 
        // $headers .= "MIME-Version: 1.0\r\n";
        // $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $mail->msgHTML($message);

        if($mail->send()){
         http_response_code(200);
         echo json_encode(
          array(
            "status" => true,
            "message" =>"Estimate has been created successfully")
        );
       }
       else {
         echo json_encode(
          array(
            "status" => false,
            "message" => "Error description: " . mysqli_error($con),
          )
        );
       }
       return true;

       ?>