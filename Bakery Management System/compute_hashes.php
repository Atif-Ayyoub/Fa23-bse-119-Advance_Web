<?php
$tests = ['admin','admin123','password','123456','cblake','mcooper','admin1234','admin@123'];
foreach($tests as $t){
    echo $t.":".md5($t).PHP_EOL;
}
