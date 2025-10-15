<?php
header("Content-Type: application/json");

include("../config/db.php");
include("../config/cors.php");
require "../vendor/autoload.php";

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "YOUR_SECRET_KEY"; // same as login.php

// 1️⃣ Get Authorization header safely
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) { // some servers lowercase it
        $authHeader = $headers['authorization'];
    }
}

if (!$authHeader) {
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
    exit;
}

// 2️⃣ Extract token
$token = str_replace("Bearer ", "", $authHeader);

try {
    // 3️⃣ Decode token
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));

    // 4️⃣ Token valid → fetch users
    $sql = "SELECT id, name, email, role, created_at FROM users";
    $result = $conn->query($sql);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Users retrieved successfully",
        "logged_in_user" => $decoded->data,
        "users" => $users
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
}
