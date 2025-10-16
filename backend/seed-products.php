<?php
include("config/db.php"); // adjust path if needed

// Sample categories
$categories = ["Electronics", "Books", "Clothing", "Toys", "Home & Kitchen"];

// Path to uploads folder
$uploadsDir = __DIR__ . "/uploads";

// Get all image files in uploads folder
$images = array_filter(scandir($uploadsDir), function($file) use ($uploadsDir) {
    return !is_dir($uploadsDir . "/" . $file) && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file);
});

// If no images found, fallback to placeholder
if (empty($images)) {
    $images = ["placeholder.png"];
}

// Loop to create 50 products
for ($i = 1; $i <= 50; $i++) {
    $name = "Sample Product $i";
    $sku = "SKU" . str_pad($i, 4, "0", STR_PAD_LEFT);
    $price = rand(100, 5000); // random price
    $stock = rand(1, 100);    // random stock
    $category = $categories[array_rand($categories)];
    $description = "This is a description for $name";

    // Pick a random image from uploads
    $image = $images[array_rand($images)];

    $status = "active";
    $created_by = 1;

    $sql = "INSERT INTO products (name, sku, description, price, stock, category, image, status, created_by)
            VALUES ('$name','$sku','$description','$price','$stock','$category','$image','$status','$created_by')";

    if ($conn->query($sql)) {
        echo "Inserted: $name with image: $image\n";
    } else {
        echo "Error inserting $name: " . $conn->error . "\n";
    }
}

$conn->close();

echo "✅ 50 products inserted successfully!";
?>
