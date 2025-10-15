<?php
include("../config/cors.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true"); 
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("../config/db.php");
include("../config/cors.php");
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
if (!$authHeader && isset($_SERVER['HTTP_X_ACCESS_TOKEN'])) {
    $authHeader = $_SERVER['HTTP_X_ACCESS_TOKEN'];
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

// 2️⃣ Get POSTed JSON
$input = json_decode(file_get_contents("php://input"), true);
$product_id = $input['product_id'] ?? 0;
$quantity   = $input['quantity'] ?? 1;

// 3️⃣ Validate required fields
if (!$product_id || $quantity < 1) {
    echo json_encode(["status"=>"error","message"=>"Product ID and quantity are required"]);
    exit;
}

// 4️⃣ Check if product already in cart
$checkSql = "SELECT id, quantity FROM carts WHERE user_id='$user_id' AND product_id='$product_id'";
$result = $conn->query($checkSql);

if ($result->num_rows > 0) {
    // Product exists, update quantity
    $row = $result->fetch_assoc();
    $newQty = $row['quantity'] + $quantity;
    $updateSql = "UPDATE carts SET quantity='$newQty' WHERE id='".$row['id']."'";
    if ($conn->query($updateSql)) {
        echo json_encode([
            "status"=>"success",
            "message"=>"Cart updated",
            "cart_id"=>$row['id'], 
            "quantity"=>$newQty
        ]);
    } else {
        echo json_encode(["status"=>"error","message"=>$conn->error]);
    }
} else {
    // 5️⃣ Reuse deleted cart ID if exists
    $missingIdSql = "SELECT MIN(t1.id + 1) AS next_id
                     FROM carts t1
                     LEFT JOIN carts t2 ON t1.id + 1 = t2.id
                     WHERE t2.id IS NULL";
    $missingResult = $conn->query($missingIdSql);
    $row = $missingResult->fetch_assoc();
    $nextId = $row['next_id'] ?? null;

    // Insert with reused ID or auto_increment
    if ($nextId === null) {
        $insertSql = "INSERT INTO carts (user_id, product_id, quantity) VALUES ('$user_id','$product_id','$quantity')";
    } else {
        $insertSql = "INSERT INTO carts (id, user_id, product_id, quantity) VALUES ('$nextId','$user_id','$product_id','$quantity')";
    }

    if ($conn->query($insertSql)) {
        echo json_encode([
            "status"=>"success",
            "message"=>"Product added to cart",
            "cart_id"=>$conn->insert_id ?? $nextId,
            "quantity"=>$quantity
        ]);
    } else {
        echo json_encode(["status"=>"error","message"=>$conn->error]);
    }
}
?>
