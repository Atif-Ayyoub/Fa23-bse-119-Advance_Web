<?php
require_once __DIR__ . '/DBConnection.php';
$db = new DBConnection();
$conn = $db->db_connect();
$q = $conn->query("SELECT * FROM category_list WHERE delete_flag = 0 ORDER BY category_id ASC");
$rows = [];
while($c = $q->fetch_assoc()){
    $cid = $c['category_id'];
    $cnt = $conn->query("SELECT COUNT(*) as cnt FROM product_list WHERE category_id = '{$cid}' AND delete_flag = 0")->fetch_assoc()['cnt'];
    $rows[] = ['category_id'=>$cid,'name'=>$c['name'],'status'=>$c['status'],'products'=>$cnt];
}
echo json_encode(['categories'=>$rows], JSON_PRETTY_PRINT);