<?php
require_once '../config.php';

$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method === 'POST') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        exit();
    }

    $upload_dir = '../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $file = $_FILES['file'];
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Simple validation
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($file_ext, $allowed_exts)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type']);
        exit();
    }

    $new_name = generate_uuid() . '.' . $file_ext;
    $target_file = $upload_dir . $new_name;

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        // Return full URL to frontend
        $file_url = $base_url . 'uploads/' . $new_name;
        echo json_encode(['file_url' => $file_url, 'success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed for upload']);
}
?>
