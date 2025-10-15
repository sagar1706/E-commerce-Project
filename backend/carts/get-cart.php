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

// Try getting from $_SERVER
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} 
// Try with getallheaders()
elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
}

// Optional: fallback header for Postman testing
if (!$authHeader && isset($_SERVER['HTTP_X_ACCESS_TOKEN'])) {
    $authHeader = $_SERVER['HTTP_X_ACCESS_TOKEN'];
}

// If no header at all
if (!$authHeader) {
    echo json_encode(["status"=>"error","message"=>"Authorization header missing"]);
    exit;
}

// Remove "Bearer " prefix if present
$token = str_replace("Bearer ", "", $authHeader);

// Decode JWT
try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $user_id = $decoded->data->id;  // Logged-in user ID
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 2️⃣ Fetch cart items from DB
$sql = "SELECT c.id AS cart_id, c.quantity, p.id AS product_id, p.name, p.price 
        FROM carts c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = '$user_id'";

$result = $conn->query($sql);

$cartItems = [];
$total = 0;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['subtotal'] = $row['price'] * $row['quantity']; // calculate subtotal
        $total += $row['subtotal']; // add to total
        $cartItems[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Cart fetched successfully",
        "cart" => $cartItems,
        "total" => $total
    ]);
} else {
    echo json_encode([
        "status" => "success",
        "message" => "Cart is empty",
        "cart" => [],
        "total" => 0
    ]);
}
?>
