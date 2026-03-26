<?php
require_once '../config.php';

$request_method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"), true);

// Get current user auth
if ($request_method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'me') {
    // In a real app we would decode JWT or session token.
    // For local mock we simply rely on the frontend passing the user ID context or assume admin if they request it.
    // Simulating the base44.auth.me() admin check wrapper
    $role = isset($_GET['role']) ? $_GET['role'] : '';
    if ($role === 'admin') {
        echo json_encode(['id' => 'admin_1', 'role' => 'admin', 'name' => 'Admin User']);
    }
    else {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
    }
}

// Handle admin login
else if ($request_method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'admin_login') {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // Hardcoded admin login as requested
    if ($username === 'MechFinder' && $password === 'MechFinder@123') {
        echo json_encode(['id' => 'admin_1', 'role' => 'admin', 'username' => 'MecFinder']);
    }
    else {
        http_response_code(401);
        echo json_encode(['error' => 'invalid user and password']);
    }
}
?>
