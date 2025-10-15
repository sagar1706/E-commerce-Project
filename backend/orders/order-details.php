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

// 1️⃣ JWT Authentication (robust)
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
}

if (!$authHeader) {
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
    exit;
}

$token = str_replace("Bearer ", "", $authHeader);

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $user_id = $decoded->data->id;
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
    exit;
}

// 2️⃣ Get order_id from GET or POST (for flexibility)
$order_id = $_GET['order_id'] ?? $_POST['order_id'] ?? 0;
if (!$order_id) {
    echo json_encode(["status" => "error", "message" => "Order ID is required"]);
    exit;
}

// 3️⃣ Fetch the order (ensure it belongs to logged-in user)
$orderSql = "SELECT * FROM orders WHERE id='$order_id' AND user_id='$user_id'";
$orderResult = $conn->query($orderSql);

if ($orderResult->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Order not found or does not belong to you"]);
    exit;
}

$order = $orderResult->fetch_assoc();

// 4️⃣ Fetch order items
$itemsSql = "SELECT oi.id AS order_item_id, oi.product_id, p.name, oi.quantity, oi.price, oi.subtotal
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id='$order_id'";
$itemsResult = $conn->query($itemsSql);

$items = [];
while ($item = $itemsResult->fetch_assoc()) {
    $items[] = $item;
}

// 5️⃣ Return JSON
echo json_encode([
    "status" => "success",
    "message" => "Order details fetched successfully",
    "order" => [
        "order_id" => $order['id'],
        "total_amount" => $order['total_amount'],
        "status" => $order['status'],
        "created_at" => $order['created_at'],
        "items" => $items
    ]
]);
?>
