<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

$app->config('templates.path', '../../webapp');

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

// GET route

$app->get('/', function () use ($app) {
    $app->render('index.html');
});

$app->get('/test/:city', function($city){
    echo "City name before: " . $city;
});


/* This hacky bit allows us to dynamically render the static files 
that the front-end uses (such as js / css) 
PLACE AFTER ALL OTHER ROUTES
ROUTES DEFINED AFTER THIS ONE WILL BE OVERWRITTEN
*/
$app->get('/:public+', function ($public) use ($app) {
    $tgt = '';
    foreach ($public as $key => $value) {
        $tgt .= $value . '/';
    }
    $tgt = rtrim($tgt, '/');
    $app->render($tgt);
});


// POST route
$app->post(
    '/post',
    function () {
        echo 'This is a POST route';
    }
);

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
