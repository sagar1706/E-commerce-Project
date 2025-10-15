    <?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    require "../config/db.php";
    include("../config/cors.php");
    require "../vendor/autoload.php";

    use \Firebase\JWT\JWT;
    use \Firebase\JWT\Key;

    $secret_key = "YOUR_SECRET_KEY"; // same key as login.php

    // Handle preflight
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
    }

    // Read JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Verify JWT token
    $headers = getallheaders();
    if (!isset($headers["Authorization"])) {
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
    exit;
    }

    $authHeader = trim(str_replace("Bearer", "", $headers["Authorization"]));

    try {
    $decoded = JWT::decode($authHeader, new Key($secret_key, 'HS256'));
    $user_id = $decoded->data->id;
    } catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
    exit;
    }

    // Validate required data
    if (!isset($data["total_amount"], $data["items"]) || !is_array($data["items"])) {
    echo json_encode(["status" => "error", "message" => "Invalid order data"]);
    exit;
    }

    $total_amount = $data["total_amount"];
    $items = $data["items"]; // array of items [{product_id, quantity, price}]
    $address = $data["address"] ?? "Not Provided";
    $payment_status = "Pending"; // or "Success" after real payment gateway integration

    // Insert order
    $conn->begin_transaction();
    try {
    $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, address, payment_status, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("idss", $user_id, $total_amount, $address, $payment_status);
    $stmt->execute();
    $order_id = $conn->insert_id;
    $stmt->close();

    // Insert each order item
    $stmtItem = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($items as $item) {
        $stmtItem->bind_param("iiid", $order_id, $item["product_id"], $item["quantity"], $item["price"]);
        $stmtItem->execute();
    }
    $stmtItem->close();

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Order placed successfully!",
        "order_id" => $order_id
    ]);
    } catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Order failed: " . $e->getMessage()]);
    }
    ?>
