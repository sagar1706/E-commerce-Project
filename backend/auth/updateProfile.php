<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include("../config/db.php");
include("../config/cors.php");
require "../vendor/autoload.php";
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "YOUR_SECRET_KEY";

// Get token
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader && function_exists('getallheaders')) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
}
if (!$authHeader) { http_response_code(401); echo json_encode(["message"=>"Authorization missing"]); exit; }

$token = str_replace("Bearer ", "", $authHeader);

try {
    $decoded = JWT::decode($token, new Key($secret_key,'HS256'));
    $userId = $decoded->data->id;

    // Get POST data
    $input = json_decode(file_get_contents("php://input"), true);
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$name || !$email) {
        http_response_code(400);
        echo json_encode(["message"=>"Name and email are required"]);
        exit;
    }

    // Update query
    if ($password) {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET name=?, email=?, password=? WHERE id=?");
        $stmt->bind_param("sssi", $name, $email, $hashed, $userId);
    } else {
        $stmt = $conn->prepare("UPDATE users SET name=?, email=? WHERE id=?");
        $stmt->bind_param("ssi", $name, $email, $userId);
    }

    if ($stmt->execute()) {
        echo json_encode(["status"=>"success","message"=>"Profile updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["status"=>"error","message"=>"Failed to update profile"]);
    }

} catch(Exception $e) {
    http_response_code(401);
    echo json_encode(["status"=>"error","message"=>"Invalid or expired token"]);
}
?>
