<?php

Class DBConnection{
    protected $db;
    function __construct(){
        $host = getenv('DB_HOST') && getenv('DB_HOST') !== false ? getenv('DB_HOST') : 'localhost';
        $user = getenv('DB_USERNAME') && getenv('DB_USERNAME') !== false ? getenv('DB_USERNAME') : 'root';
        $pass = getenv('DB_PASSWORD') && getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';
        $db   = getenv('DB_DATABASE') && getenv('DB_DATABASE') !== false ? getenv('DB_DATABASE') : 'bsms_db';

        $this->db = new mysqli($host, $user, $pass, $db);
        if ($this->db->connect_errno) {
            die('Database Connection Failed. Error: '.$this->db->connect_error);
        }

    }
    function db_connect(){
        return $this->db;
    }
    function __destruct(){
         $this->db->close();
    }
}

function format_num($number = '',$decimal=''){
    if(is_numeric($number)){
        $ex = explode(".",$number);
        $dec_len = isset($ex[1]) ? strlen($ex[1]) : 0;
        if(!empty($decimal) || is_numeric($decimal)){
            return number_format($number,$decimal);
        }else{
            return number_format($number,$dec_len);
        }
    }else{
        return 'Invalid input.';
    }
}

$db = new DBConnection();
$conn = $db->db_connect();