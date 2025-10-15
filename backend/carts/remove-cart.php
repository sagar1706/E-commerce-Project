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

// 1️⃣ Robust JWT Authentication
$authHeader = '';

// Try $_SERVER first
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} 
// Fallback to getallheaders()
elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
}

// Optional fallback for Postman
if (!$authHeader && isset($_SERVER['HTTP_X_ACCESS_TOKEN'])) {
    $authHeader = $_SERVER['HTTP_X_ACCESS_TOKEN'];
}

if (!$authHeader) {
    echo json_encode(["status"=>"error","message"=>"Authorization header missing"]);
    exit;
}

// Remove "Bearer " prefix if present
$token = str_replace("Bearer ", "", $authHeader);

// Decode JWT
try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $user_id = $decoded->data->id;  
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 2️⃣ Get POSTed JSON
$input = json_decode(file_get_contents("php://input"), true);
$cart_id = $input['cart_id'] ?? 0;

// 3️⃣ Validate
if (!$cart_id) {
    echo json_encode(["status"=>"error","message"=>"Cart ID is required"]);
    exit;
}

// 4️⃣ Delete cart item (only if it belongs to the logged-in user)
$sql = "DELETE FROM carts WHERE id='$cart_id' AND user_id='$user_id'";

if ($conn->query($sql)) {
    if ($conn->affected_rows > 0) {
        // ✅ Deleted successfully. That ID can now be reused in add-to-cart.php automatically.
        echo json_encode([
            "status"=>"success",
            "message"=>"Item removed from cart",
            "deleted_cart_id" => $cart_id
        ]);
    } else {
        echo json_encode([
            "status"=>"error",
            "message"=>"Item not found or not yours"
        ]);
    }
} else {
    echo json_encode([
        "status"=>"error",
        "message"=>$conn->error
    ]);
}
?>
