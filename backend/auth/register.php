<?php
include("../config/cors.php");
include("../config/db.php");

require "../vendor/autoload.php"; // JWT library
use \Firebase\JWT\JWT;

$secret_key = "YOUR_SECRET_KEY"; // change this to a strong random string

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['email'], $data['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Name, email, and password are required"
    ]);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);

// Check if email already exists
$sql_check = "SELECT * FROM users WHERE email='$email'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already registered"
    ]);
    exit;
}

// Insert user into database
$sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email')";
if ($conn->query($sql)) {
    $user_id = $conn->insert_id; // get the newly created user ID

    // Create payload for JWT
    $payload = [
        "iss" => "localhost",
        "aud" => "localhost",
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24), // token expires in 24 hours
        "data" => [
            "id" => $user_id,
            "name" => $name,
            "email" => $email,
            "role" => "user" // default role
        ]
    ];

    $jwt = JWT::encode($payload, $secret_key, 'HS256');

    // Return JWT + user info
    echo json_encode([
        "status" => "success",
        "message" => "User registered successfully",
        "token" => $jwt,
        "user" => [
            "id" => $user_id,
            "name" => $name,
            "email" => $email,
            "role" => "user"
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Registration failed: " . $conn->error
    ]);
}
