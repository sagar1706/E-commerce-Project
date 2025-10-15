<?php
$host = "localhost";
$user = "phpmyadmin";
$pass = "Sagar@123";
$db   = "ecommerce_sagar";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB Connection failed: " . $conn->connect_error]));
}
