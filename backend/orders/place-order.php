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
    $user_id = $decoded->data->id;  // Logged-in user ID
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 2️⃣ Fetch all cart items for this user
$cartSql = "SELECT c.product_id, c.quantity, p.price, p.stock, p.name 
            FROM carts c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id='$user_id'";
$cartResult = $conn->query($cartSql);

if ($cartResult->num_rows == 0) {
    echo json_encode(["status"=>"error","message"=>"Cart is empty"]);
    exit;
}

$totalAmount = 0;
$cartItems = [];

while ($row = $cartResult->fetch_assoc()) {
    // Check stock availability
    if ($row['quantity'] > $row['stock']) {
        echo json_encode([
            "status"=>"error",
            "message"=>"Product '{$row['name']}' does not have enough stock"
        ]);
        exit;
    }

    $subtotal = $row['price'] * $row['quantity'];
    $totalAmount += $subtotal;

    $cartItems[] = [
        'product_id' => $row['product_id'],
        'quantity' => $row['quantity'],
        'price' => $row['price'],
        'subtotal' => $subtotal
    ];
}

// 3️⃣ Insert into orders table
$orderSql = "INSERT INTO orders (user_id, total_amount, status) 
             VALUES ('$user_id', '$totalAmount', 'pending')";
if ($conn->query($orderSql)) {
    $order_id = $conn->insert_id;

    // 4️⃣ Insert each item into order_items and update product stock
    foreach ($cartItems as $item) {
        $conn->query("INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) 
                      VALUES ('$order_id', '{$item['product_id']}', '{$item['quantity']}', '{$item['price']}', '{$item['subtotal']}')");

        // Update product stock
        $conn->query("UPDATE products SET stock = stock - {$item['quantity']} WHERE id = '{$item['product_id']}'");
    }

    // 5️⃣ Clear user cart
    $conn->query("DELETE FROM carts WHERE user_id='$user_id'");

    echo json_encode([
        "status"=>"success",
        "message"=>"Order placed successfully",
        "order_id"=>$order_id,
        "total"=>$totalAmount
    ]);
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
?>
