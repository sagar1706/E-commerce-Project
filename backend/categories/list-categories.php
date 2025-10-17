<?php
include "../config/cors.php";
require_once "../config/db.php"; // $conn from mysqli

// Enable error reporting temporarily
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $query = "SELECT id, name, slug, image FROM categories ORDER BY id ASC";
    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    echo json_encode($categories);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to fetch categories",
        "details" => $e->getMessage()
    ]);
}
