<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
include("../config/cors.php");
include("../config/db.php");
require "../vendor/autoload.php";

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "YOUR_SECRET_KEY";

// 1️⃣ JWT Authentication
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) $authHeader = $headers['Authorization'];
    elseif (isset($headers['authorization'])) $authHeader = $headers['authorization'];
}

if (!$authHeader) {
    echo json_encode(["status"=>"error","message"=>"Authorization header missing"]);
    exit;
}

$token = str_replace("Bearer ", "", $authHeader);

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $user_id = $decoded->data->id;
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 2️⃣ Get JSON body
$input = json_decode(file_get_contents("php://input"), true);
$cart_id = $input['cart_id'] ?? 0;
$change  = $input['change'] ?? 0;  // change can be +1 or -1

// 3️⃣ Validate
if (!$cart_id || $change === 0) {
    echo json_encode(["status"=>"error","message"=>"Cart ID and valid change are required"]);
    exit;
}

// 4️⃣ Update quantity safely
$sql = "UPDATE carts 
        SET quantity = quantity + $change 
        WHERE id='$cart_id' AND user_id='$user_id' AND quantity + $change > 0";

if ($conn->query($sql)) {
    if ($conn->affected_rows > 0) {
        // ✅ Success
        echo json_encode(["status"=>"success","message"=>"Cart updated successfully","cart_id"=>$cart_id]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Cart item not found or quantity invalid"]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
?>
