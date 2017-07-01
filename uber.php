<?php 




$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Authorization:Token Xop36HQP1Z2KPeRO1bvkOfnvtmfxMbb1TBEvqGib\r\n".
    		  "Accept-Language:en_US\r\n".
    		  "Content-Type:application/json\r\n"
  )
);

$context = stream_context_create($opts);

$params = $_GET;
unset($params['url']);

// var_dump($params);

$url = $_GET['url'].'?'.http_build_query($params);

$file = file_get_contents($url, false, $context);

header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
echo $file;

?>