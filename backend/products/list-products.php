<?php
include("../config/cors.php");


include("../config/db.php");

require "../vendor/autoload.php";

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "YOUR_SECRET_KEY";

// Optional: JWT auth for admin-only listing
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if ($authHeader) {
    $token = str_replace("Bearer ", "", $authHeader);
    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        $user_id = $decoded->data->id;
    } catch (Exception $e) {
        echo json_encode(["status"=>"error","message"=>"Invalid token"]);
        exit;
    }
}

// 1️⃣ Get filters from query params
$category = $_GET['category'] ?? '';
$search   = $_GET['search'] ?? '';
$minPrice = $_GET['minPrice'] ?? 0;
$maxPrice = $_GET['maxPrice'] ?? 0;
$page     = $_GET['page'] ?? 1;
$limit    = $_GET['limit'] ?? 50;
$offset   = ($page - 1) * $limit;

// 2️⃣ Build SQL
$sql = "SELECT * FROM products WHERE 1";

if ($category) $sql .= " AND category = '".$conn->real_escape_string($category)."'";
if ($search) $sql .= " AND (name LIKE '%".$conn->real_escape_string($search)."%' OR sku LIKE '%".$conn->real_escape_string($search)."%')";
if ($minPrice) $sql .= " AND price >= ".floatval($minPrice);
if ($maxPrice) $sql .= " AND price <= ".floatval($maxPrice);

$sql .= " ORDER BY id ASC LIMIT $offset, $limit";

// 3️⃣ Execute query
$result = $conn->query($sql);

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

// 4️⃣ Return JSON
echo json_encode([
    "status" => "success",
    "page" => $page,
    "limit" => $limit,
    "count" => count($products),
    "products" => $products
]);
?>
