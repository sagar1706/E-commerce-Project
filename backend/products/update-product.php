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

// 3️⃣ Get POSTed JSON (update data)
$data = json_decode(file_get_contents("php://input"), true);

// Product ID is required
if (!isset($data['id'])) {
    echo json_encode(["status"=>"error","message"=>"Product ID is required"]);
    exit;
}

$product_id = intval($data['id']);

// 4️⃣ Build update fields dynamically
$update_fields = [];

if (isset($data['name'])) $update_fields[] = "name='" . $conn->real_escape_string($data['name']) . "'";
if (isset($data['sku'])) $update_fields[] = "sku='" . $conn->real_escape_string($data['sku']) . "'";
if (isset($data['description'])) $update_fields[] = "description='" . $conn->real_escape_string($data['description']) . "'";
if (isset($data['price'])) $update_fields[] = "price=" . floatval($data['price']);
if (isset($data['stock'])) $update_fields[] = "stock=" . intval($data['stock']);
if (isset($data['category'])) $update_fields[] = "category='" . $conn->real_escape_string($data['category']) . "'";
if (isset($data['image'])) $update_fields[] = "image='" . $conn->real_escape_string($data['image']) . "'";
if (isset($data['status'])) $update_fields[] = "status='" . $conn->real_escape_string($data['status']) . "'";

if (empty($update_fields)) {
    echo json_encode(["status"=>"error","message"=>"No fields to update"]);
    exit;
}

$update_sql = "UPDATE products SET " . implode(", ", $update_fields) . " WHERE id=$product_id";

// 5️⃣ Execute update
if ($conn->query($update_sql)) {
    echo json_encode([
        "status"=>"success",
        "message"=>"Product updated successfully",
        "product_id"=>$product_id
    ]);
} else {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
}
