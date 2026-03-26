<?php
// CORS Headers to allow React frontend at localhost:5173 to communicate
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'YOUR_DB_HOST'; // e.g., sql123.epizy.com
$db_name = 'YOUR_DB_NAME'; // e.g., epiz_12345678_mech_db
$username = 'YOUR_DB_USER'; // e.g., epiz_12345678
$password = 'YOUR_DB_PASSWORD'; // e.g., your unique password
$connection = null;

try {
    $connection = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $connection->exec("set names utf8");
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("error" => "Database Connection error: " . $exception->getMessage()));
    exit();
}

// Helper to generate a UUID-like string for IDs
function generate_uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000, 
        mt_rand(0, 0x3fff) | 0x8000, 
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// Base application URL - adjust this to your InfinityFree domain
$base_url = "http://YOUR_INFINITYFREE_DOMAIN.epizy.com/backend/";
?>
