<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

include("../config/db.php");
include("../config/cors.php");
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
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 2️⃣ Get JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['name'], $data['sku'], $data['price'])) {
    echo json_encode(["status"=>"error","message"=>"Name, SKU and price are required"]);
    exit;
}

$name        = $conn->real_escape_string($data['name']);
$sku         = $conn->real_escape_string($data['sku']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';
$price       = floatval($data['price']);
$stock       = isset($data['stock']) ? intval($data['stock']) : 0;
$category    = isset($data['category']) ? $conn->real_escape_string($data['category']) : 'General';
$image       = isset($data['image']) ? $conn->real_escape_string($data['image']) : '';
$status      = isset($data['status']) ? $conn->real_escape_string($data['status']) : 'active';
$created_by  = isset($decoded->data->id) ? $decoded->data->id : 0;

// 3️⃣ Find the smallest available ID (reuse deleted IDs)
$result = $conn->query("
    SELECT t1.id + 1 AS next_id
    FROM products t1
    LEFT JOIN products t2 ON t1.id + 1 = t2.id
    WHERE t2.id IS NULL
    ORDER BY t1.id
    LIMIT 1
");

$next_id = 1; // default if table empty
if ($row = $result->fetch_assoc()) {
    $next_id = $row['next_id'];
}

// 4️⃣ Insert product with custom ID
$sql = "INSERT INTO products (id, name, sku, description, price, stock, category, image, status, created_by)
        VALUES ('$next_id','$name','$sku','$description','$price','$stock','$category','$image','$status','$created_by')";

if ($conn->query($sql)) {
    echo json_encode([
        "status"=>"success",
        "message"=>"Product created successfully",
        "product_id"=>$next_id
    ]);
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
?>
