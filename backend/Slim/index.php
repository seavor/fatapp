<?php

///////////////////////////////////////////////////////////////////////////////////////////////////

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

///////////////////////////////////////////////////////////////////////////////////////////////////

// Set Default Timezone
date_default_timezone_set("America/New_York");

// Establish Database Connection
function jcoreDB() {
    $dbhost = '54.213.127.189';
    $dbuser = 'adminx';
    $dbpass = 'banana';
    $dbname = 'jcore';
    $connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
    return $connection;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/test/:city', function($city) {

    $db = jcoreDB();

    echo "City name before: " . $city;

    // Get Restaurant List
    $query = "SELECT * FROM Items";
    $rests = mysqli_query($db, $query);
    while ($row = mysqli_fetch_assoc($rests)) {
        echo '<pre>';
        print_r($row);
        echo '</pre>';
    }

    mysqli_free_result($rests);
    mysqli_close($db);

});

// POST route
// $app->post(
//     '/post',
//     function () {
//         echo 'This is a POST route';
//     }
// );

// // PUT route
// $app->put(
//     '/put',
//     function () {
//         echo 'This is a PUT route';
//     }
// );

// // PATCH route
// $app->patch('/patch', function () {
//     echo 'This is a PATCH route';
// });

// // DELETE route
// $app->delete(
//     '/delete',
//     function () {
//         echo 'This is a DELETE route';
//     }
// );

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
