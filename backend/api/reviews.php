<?php
require_once '../config.php';

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        // GET /api/reviews.php?mechanic_id=123
        if (!isset($_GET['mechanic_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "mechanic_id required"]);
            break;
        }
        
        $query = "SELECT * FROM reviews WHERE mechanic_id = ?";
        if (isset($_GET['sort']) && $_GET['sort'] === '-created_date') {
            $query .= " ORDER BY created_date DESC";
        }
        
        $stmt = $connection->prepare($query);
        $stmt->execute([$_GET['mechanic_id']]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res);
        break;

    case 'POST':
        // POST /api/reviews.php
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['mechanic_id']) || !isset($data['reviewer_name']) || !isset($data['rating'])) {
             http_response_code(400);
             echo json_encode(["error" => "Missing required fields"]);
             break;
        }

        $id = generate_uuid();
        $stmt = $connection->prepare("INSERT INTO reviews (id, mechanic_id, reviewer_name, rating, comment) VALUES (?, ?, ?, ?, ?)");
        
        try {
            $stmt->execute([
                $id,
                $data['mechanic_id'],
                $data['reviewer_name'],
                $data['rating'],
                $data['comment'] ?? ''
            ]);
            echo json_encode(["id" => $id, "message" => "Review added"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;
}
?>
