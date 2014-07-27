<?php

///////////////////////////////////////////////////////////////////////////////////////////////////

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

///////////////////////////////////////////////////////////////////////////////////////////////////

// Set Default Timezone
date_default_timezone_set("America/New_York");

include 'data.php';

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////



// Get Restaurant List (delivery zone)
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/rl/:zip/:city/:addr', function($zip, $city, $addr) {

    // Ordr.in Tree
    $data = json_decode(file_get_contents(RESTHOST . 'dl/ASAP/' . urlencode($zip) . '/' . urlencode($city) . '/' . urlencode($addr) . '?_auth=1,' . APIKEY), true);

    $db = openConnection();

    $query = "SELECT rating, filters, id FROM Restaurants WHERE activated = 1";
    $rests = mysqli_query($db, $query);

    while ($row = mysqli_fetch_assoc($rests)) {
        foreach ($data as $key => $value) {
            if ($row['id'] == $value['id']) {
                $value['rating'] = $row['rating'];
                $value['filters'] = json_decode($row['filters']);
                $restaurants[] = $value;
            }
        }
    }

    mysqli_free_result($rests);
    mysqli_close($db);

    echo json_encode($restaurants);

});


// Get Restaurant Details (menu)
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/rd/:rid', function($rid) {
    echo 'restaurant details: ' . $rid;

});


// Get Fee (based on subtotal & address)
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/fee/:rid/:subtotal/:tip/:datetime/:zip/:city/:addr', function($rid, $subtotal, $tip, $datetime, $zip, $city, $addr) {

    $reqUrl =
        RESTHOST.
        'fee/'.
        urlencode($rid).'/'.
        urlencode($subtotal).'/'.
        urlencode($tip).'/'.
        urlencode($datetime).'/'.
        urlencode($zip).'/'.
        urlencode($city).'/'.
        urlencode($addr).'/'.
        '?_auth=1,'.APIKEY;

    $data = file_get_contents($reqUrl);

    echo $data;

});


// Post Order
///////////////////////////////////////////////////////////////////////////////////////////////////
$app->post('/order/:rid', function($rid) use ($app) {
    $body = $app->request->getBody();

    echo 'make order: ' . $body;
});




// == user stuff ==

// * create account

// * get saved addresses (for user)

// * create new address

// * get saved CCs

// * create new CC

// * order history (?)

// * login call

$app->run();
