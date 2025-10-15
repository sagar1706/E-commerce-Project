<?php


// ✅ 2. Handle CORS preflight request (important!)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("../config/db.php");
include("../config/cors.php");
require "../vendor/autoload.php";

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// IMPORTANT: This key MUST match the one in login.php
$secret_key = "YOUR_SECRET_KEY";

// ✅ 3. Get Authorization header safely
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) { 
        $authHeader = $headers['authorization'];
    }
}

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
    exit;
}

// ✅ 4. Extract token
$token = str_replace("Bearer ", "", $authHeader);

try {
    // ✅ 5. Decode token and validate
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    
    $userId = $decoded->data->id;

    // ✅ 6. Fetch the logged-in user's details
    $sql = "SELECT id, name, email, role, created_at FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "User profile retrieved successfully",
            "user" => $user
        ]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

} catch (Exception $e) {
    // ✅ 7. Handle invalid or expired tokens
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
}
?>

