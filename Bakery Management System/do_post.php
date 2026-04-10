<?php
$url = 'http://localhost:8000/Actions.php?a=login';
$data = array('username'=>'admin','password'=>'admin123');
$options = array(
  'http' => array(
    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
    'method'  => 'POST',
    'content' => http_build_query($data),
    'ignore_errors' => true
  )
);
$context  = stream_context_create($options);
$result = @file_get_contents($url, false, $context);
if ($result === false) {
    echo "Request failed\n";
    if (isset($http_response_header)){
        echo implode("\n", $http_response_header)."\n";
    }
    exit(1);
}
if (isset($http_response_header)) echo implode("\n", $http_response_header)."\n\n";
echo $result;
