<?php
$url = 'http://localhost:8000/sales.php';
$opts = ['http'=>['method'=>'GET','ignore_errors'=>true]];
$ctx = stream_context_create($opts);
$res = @file_get_contents($url,false,$ctx);
if($res === false){
    if(isset($http_response_header)) echo implode("\n", $http_response_header)."\n";
    echo "Request failed\n";
    exit(1);
}
foreach($http_response_header as $h) echo $h."\n";

// Print the first 1000 characters to check for fatal errors
echo PHP_EOL.substr($res,0,1000);
