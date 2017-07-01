<?php 

$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"X-APP-TOKEN:4e8bcd4ad3d640ff8bade717d86710c5"
  )
);

$context = stream_context_create($opts);

$params = $_GET;
unset($params['url']);

// var_dump($params);

$url = $_GET['url'].'?'.http_build_query($params);

$file = file_get_contents($url, false, $context);

echo $file;

?>