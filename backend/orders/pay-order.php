<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
include("../config/cors.php");

// 1️⃣ Include database connection
include("../config/db.php");

// 2️⃣ Include JWT library
require "../vendor/autoload.php";
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// 3️⃣ JWT secret key
$secret_key = "YOUR_SECRET_KEY";

// 4️⃣ Get Authorization header
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) $authHeader = $headers['Authorization'];
    elseif (isset($headers['authorization'])) $authHeader = $headers['authorization'];
}

// 5️⃣ Check header
if (!$authHeader) {
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
    exit;
}

// 6️⃣ Extract token
$token = str_replace("Bearer ", "", $authHeader);

// 7️⃣ Decode JWT
try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    $user_id = $decoded->data->id;
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
    exit;
}

// 8️⃣ Get POST data
$input = json_decode(file_get_contents("php://input"), true);
$order_id = $input['order_id'] ?? 0;
$payment_method = trim($input['payment_method'] ?? '');
$amount = floatval($input['amount'] ?? 0);

// 9️⃣ Validate input
if (!$order_id || !$payment_method || $amount <= 0) {
    echo json_encode(["status" => "error", "message" => "Order ID, payment method, and amount are required"]);
    exit;
}

// ✅ Input length checks
if (strlen($payment_method) > 100) {
    echo json_encode(["status" => "error", "message" => "Payment method too long (max 100 chars)"]);
    exit;
}

// 1️⃣0️⃣ Check if order exists & belongs to user
$stmt = $conn->prepare("SELECT total_amount, status FROM orders WHERE id=? AND user_id=?");
$stmt->bind_param("ii", $order_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Order not found or not yours"]);
    exit;
}

$order = $result->fetch_assoc();

// ✅ Prevent duplicate payments
if ($order['status'] === 'paid') {
    echo json_encode(["status" => "error", "message" => "Order already paid"]);
    exit;
}

$stmt_check = $conn->prepare("SELECT id FROM payments WHERE order_id=? AND user_id=? AND status='success'");
$stmt_check->bind_param("ii", $order_id, $user_id);
$stmt_check->execute();
if ($stmt_check->get_result()->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Payment already recorded"]);
    exit;
}

// ✅ Ensure payment amount matches order
if ($order['total_amount'] != $amount) {
    echo json_encode(["status" => "error", "message" => "Payment amount does not match order total"]);
    exit;
}

// 1️⃣1️⃣ Insert payment record (pending)
$status_pending = 'pending';
$stmt_insert = $conn->prepare("INSERT INTO payments (order_id, user_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)");
$stmt_insert->bind_param("iidss", $order_id, $user_id, $amount, $payment_method, $status_pending);

if (!$stmt_insert->execute()) {
    echo json_encode(["status" => "error", "message" => "Failed to insert payment: ".$conn->error]);
    exit;
}

$payment_id = $stmt_insert->insert_id;

// 1️⃣2️⃣ Simulate payment processing
$transaction_id = "TXN" . time() . rand(1000, 9999);
$status_success = trim('success');

if (strlen($status_success) > 20) {
    echo json_encode(["status" => "error", "message" => "Status value too long"]);
    exit;
}

$stmt_update = $conn->prepare("UPDATE payments SET status=?, transaction_id=? WHERE id=?");
$stmt_update->bind_param("ssi", $status_success, $transaction_id, $payment_id);

if (!$stmt_update->execute()) {
    echo json_encode(["status" => "error", "message" => "Failed to update payment: ".$conn->error]);
    exit;
}

// 1️⃣3️⃣ Update order status to paid
$stmt_order = $conn->prepare("UPDATE orders SET status='paid' WHERE id=?");
$stmt_order->bind_param("i", $order_id);
$stmt_order->execute();

// 1️⃣4️⃣ Return success response
echo json_encode([
    "status" => "success",
    "message" => "Payment successful",
    "payment_id" => $payment_id,
    "transaction_id" => $transaction_id,
    "order_id" => $order_id,
    "amount" => $amount
]);
?>
