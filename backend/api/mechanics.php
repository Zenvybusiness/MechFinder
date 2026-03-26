<?php
require_once '../config.php';

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        // GET /api/mechanics.php?id=123 (fetch single)
        // GET /api/mechanics.php?status=approved (filter)
        // GET /api/mechanics.php (list all)
        if (isset($_GET['id'])) {
            $stmt = $connection->prepare("SELECT * FROM mechanics WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $query = "SELECT * FROM mechanics WHERE 1=1";
            $params = [];
            
            if (isset($_GET['status'])) {
                $query .= " AND status = :status";
                $params['status'] = $_GET['status'];
            }
            if (isset($_GET['is_active'])) {
                $query .= " AND is_active = :is_active";
                $params['is_active'] = $_GET['is_active'] === 'true' ? 1 : 0;
            }
            if (isset($_GET['phone'])) {
                $query .= " AND phone = :phone";
                $params['phone'] = $_GET['phone'];
            }
            
            // Handle sort 
            if (isset($_GET['sort'])) {
                $sort = $_GET['sort'];
                if ($sort === '-created_date') {
                    $query .= " ORDER BY created_date DESC";
                }
            } else {
                 $query .= " ORDER BY created_date DESC";
            }

            $stmt = $connection->prepare($query);
            $stmt->execute($params);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        // decode JSON strings to array for frontend
        foreach ($res as &$row) {
            $row['shop_photos'] = json_decode($row['shop_photos'] ?? '[]', true);
            $row['specialties'] = json_decode($row['specialties'] ?? '[]', true);
            $row['is_active'] = (bool)$row['is_active'];
        }
        
        echo json_encode($res);
        break;

    case 'POST':
        // POST /api/mechanics.php (Create/Signup)
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['phone']) || !preg_match('/^[0-9]{10}$/', $data['phone'])) {
            http_response_code(400);
            echo json_encode(["error" => "Phone number must be exactly 10 digits"]);
            exit;
        }

        if (!isset($data['password']) || strlen($data['password']) < 8 || !preg_match('/[^a-zA-Z0-9]/', $data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Password must be at least 8 characters long and include a special character"]);
            exit;
        }
        
        $id = generate_uuid();
        $stmt = $connection->prepare("INSERT INTO mechanics (id, name, phone, password, shop_name, address, city, pin_code, profile_photo, shop_photos, specialties, status, payment_status, is_active, average_rating, total_reviews, section_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        try {
            $stmt->execute([
                $id,
                $data['name'] ?? '',
                $data['phone'] ?? '',
                $data['password'] ?? '',
                $data['shop_name'] ?? '',
                $data['address'] ?? '',
                $data['city'] ?? '',
                $data['pin_code'] ?? '',
                $data['profile_photo'] ?? '',
                json_encode($data['shop_photos'] ?? []),
                json_encode($data['specialties'] ?? []),
                $data['status'] ?? 'pending',
                $data['payment_status'] ?? 'unpaid',
                $data['is_active'] ?? false ? 1 : 0,
                $data['average_rating'] ?? 0,
                $data['total_reviews'] ?? 0,
                $data['section_number'] ?? ''
            ]);
            echo json_encode(["id" => $id, "message" => "Mechanic registered efficiently"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // PUT /api/mechanics.php?id=123 (Update)
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID required for update"]);
            break;
        }
        $id = $_GET['id'];
        $data = json_decode(file_get_contents("php://input"), true);
        
        $fields = [];
        $params = [];
        
        $updatable_fields = ['name', 'phone', 'shop_name', 'address', 'city', 'pin_code', 'profile_photo', 'status', 'payment_status', 'is_active', 'average_rating', 'total_reviews', 'section_number'];
        foreach ($updatable_fields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $val = $data[$field];
                if ($field === 'is_active') $val = $val ? 1 : 0;
                $params[] = $val;
            }
        }
        
        if (isset($data['shop_photos'])) {
            $fields[] = "shop_photos = ?";
            $params[] = json_encode($data['shop_photos']);
        }
        if (isset($data['specialties'])) {
            $fields[] = "specialties = ?";
            $params[] = json_encode($data['specialties']);
        }
        
        if (empty($fields)) {
            echo json_encode(["message" => "No fields to update"]);
            break;
        }
        
        $params[] = $id;
        $query = "UPDATE mechanics SET " . implode(", ", $fields) . " WHERE id = ?";
        
        try {
            $stmt = $connection->prepare($query);
            $stmt->execute($params);
            echo json_encode(["message" => "Update successful"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // DELETE /api/mechanics.php?id=123
        if (isset($_GET['id'])) {
            $stmt = $connection->prepare("DELETE FROM mechanics WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["message" => "Mechanic deleted"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID required"]);
        }
        break;
}
?>
