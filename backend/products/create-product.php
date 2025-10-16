<?php
include("../config/cors.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

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
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 2️⃣ Get POST data (since frontend is sending FormData)
$name        = isset($_POST['name']) ? $conn->real_escape_string($_POST['name']) : '';
$sku         = isset($_POST['sku']) ? $conn->real_escape_string($_POST['sku']) : '';
$description = isset($_POST['description']) ? $conn->real_escape_string($_POST['description']) : '';
$price       = isset($_POST['price']) ? floatval($_POST['price']) : 0;
$stock       = isset($_POST['stock']) ? intval($_POST['stock']) : 0;
$category    = isset($_POST['category']) ? $conn->real_escape_string($_POST['category']) : 'General';
$status      = isset($_POST['status']) ? $conn->real_escape_string($_POST['status']) : 'active';
$created_by  = isset($decoded->data->id) ? $decoded->data->id : 0;

// 3️⃣ Validate required fields
if (!$name || !$sku || !$price) {
    echo json_encode(["status"=>"error","message"=>"Name, SKU and price are required"]);
    exit;
}

// 4️⃣ Handle image upload
$image = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $targetDir = "../uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    $imageName = time() . '_' . basename($_FILES['image']['name']);
    $targetFile = $targetDir . $imageName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $image = $imageName;
    } else {
        echo json_encode(["status"=>"error","message"=>"Failed to upload image"]);
        exit;
    }
}

// 5️⃣ Find the smallest available ID (reuse deleted IDs)
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

// 6️⃣ Insert product
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
