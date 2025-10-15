<?php
include("../config/cors.php");
include("../config/db.php");

require "../vendor/autoload.php"; // JWT library

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "YOUR_SECRET_KEY"; // change this to a strong random string

// Get POSTed JSON data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required"
    ]);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

// Check if user exists
$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email not registered"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Incorrect password"
    ]);
    exit;
}

// Generate JWT
$payload = [
    "iss" => "localhost",
    "aud" => "localhost",
    "iat" => time(),
    "exp" => time() + (60 * 60 * 24), // expires in 24 hours
    "data" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
];

$jwt = JWT::encode($payload, $secret_key, 'HS256');

// Return token
echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "token" => $jwt,
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
]);
