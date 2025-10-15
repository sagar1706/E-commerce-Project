<?php
header("Content-Type: application/json");

include("../config/db.php");
include("../config/cors.php");
require "../vendor/autoload.php";

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "YOUR_SECRET_KEY"; // same as login.php

// 1️⃣ Get JWT from header
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

// 2️⃣ Decode JWT
try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
    exit;
}

// 3️⃣ Get POSTed JSON (product ID)
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["status"=>"error","message"=>"Product ID is required"]);
    exit;
}

$product_id = intval($data['id']);

// 4️⃣ Delete product
$sql = "DELETE FROM products WHERE id=$product_id";

if ($conn->query($sql)) {
    echo json_encode([
        "status"=>"success",
        "message"=>"Product deleted successfully",
        "product_id"=>$product_id
    ]);
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
