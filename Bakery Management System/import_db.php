<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'bsms_db';
$sqlFile = __DIR__ . '/database/bsms_db.sql';

$mysqli = new mysqli($host, $user, $pass);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error . "\n");
}

if (!$mysqli->query("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
    die("Database creation failed: " . $mysqli->error . "\n");
}

$mysqli->select_db($db);

$sql = file_get_contents($sqlFile);
if ($sql === false) {
    die("Failed to read SQL file: $sqlFile\n");
}

// Execute multiple statements
if ($mysqli->multi_query($sql)) {
    do {
        if ($result = $mysqli->store_result()) {
            $result->free();
        }
    } while ($mysqli->more_results() && $mysqli->next_result());
    echo "Database import completed successfully.\n";
} else {
    die("Import failed: " . $mysqli->error . "\n");
}

$mysqli->close();
