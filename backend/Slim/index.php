<?php

///////////////////////////////////////////////////////////////////////////////////////////////////

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->config('debug', true);

///////////////////////////////////////////////////////////////////////////////////////////////////

// Set Default Timezone
date_default_timezone_set("America/New_York");

include 'data.php';

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function printR($arr){
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
};
                
// Get Restaurant List (delivery zone)
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/rl/:zip/:city/:addr', function($zip, $city, $addr) {

    // Ordr.in Tree
    $data = json_decode(file_get_contents(RESTHOST . 'dl/ASAP/' . urlencode($zip) . '/' . urlencode($city) . '/' . urlencode($addr) . '?_auth=1,' . APIKEY), true);

    // @TODO This is twice as slow as the Restraunt Details call -_- #dafuq

    $db = openConnection();

    $query = "SELECT * FROM Restaurants WHERE rest_activated = 1";
    $rests = mysqli_query($db, $query);

    while ($row = mysqli_fetch_assoc($rests)) {
        foreach ($data as $key => $value) {
            if ($row['rest_id'] == $value['id']) {
                $value['rating'] = $row['rest_rating'];
                $value['filters'] = json_decode($row['filters']);
                $restaurants[] = $value;
    }   }   }

    mysqli_free_result($rests);
    mysqli_close($db);

    echo json_encode($restaurants);

});


// Get Restaurant Details (menu)
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/rd/:rid', function($rid) {

    $db = openConnection();

    $query = "SELECT * FROM Restaurants WHERE rest_id = ". $rid;
    $rest = mysqli_query($db, $query);

    $query = "SELECT * FROM Categories WHERE rest_id = ". $rid;
    $cats = mysqli_query($db, $query);

    $query = "SELECT item.* FROM Items AS item INNER JOIN Categories AS cat ON (item.cat_id = cat.cat_id) WHERE cat.rest_id = ". $rid . ' AND item.item_activated = 1';
    $items = mysqli_query($db, $query);

    $jcore = [];

    while ($restRow = mysqli_fetch_assoc($rest)) {
        // Init Cat Array
        $categories = [];

        // Add Categories to Correct Array
        while($catRow = mysqli_fetch_assoc($cats)) {
            $itemsArr = [];
            $categories[] = $catRow;
        }

        // Append Categories to Rest Array
        $restRow['categories'] = $categories;
        $restRow['filters'] = json_decode($restRow['filters']);
        $jcore = $restRow;

        // Add Items to their Categories
        while($itemRow = mysqli_fetch_assoc($items)) {
            foreach ($jcore['categories'] as $index => $category) {
                if($itemRow['cat_id'] == $category['cat_id']) {
                    $itemRow['options'] = json_decode($itemRow['options']);
                    $jcore['categories'][$index]['items'][] = $itemRow;
        }   }   }
    
    }

     // Ordr.in Tree
    $data = json_decode(file_get_contents(RESTHOST . 'rd/' . urlencode($rid) . '?_auth=1,' . APIKEY), true);

    $newData = $data;

    // put in meta-data about restaurant
    $newData['filters'] = $jcore['filters'];
    $newData['rating'] = $jcore['rest_rating'];
    $newData['tip'] = $jcore['rest_tip'];
    $newData['menu'] = $jcore['categories'];

    // @TODO add mino to restaurant menu

    // Loop thru Menu Categories & Items in Jcore structure
    foreach ($newData["menu"] as $catIdx => $cat) {
        foreach ($newData["menu"][$catIdx]['items'] as $itmIdx => $itm) {
            
            //finding the right ordr.in item...
            foreach ($data['menu'] as $oiCatIdx => $oiCat) {
                foreach ($data['menu'][$oiCatIdx]['children'] as $oiItmIdx => $oiItm) {
                    if( $oiItm['id'] == $itm['item_id']) {
                        $itemToInsert = $oiItm;
                        $itemToInsert['rating'] = $itm['item_rating'];
                        
                        // mark Jay's options as such
                        if(array_key_exists('children', $itemToInsert)) {
                            foreach ($itemToInsert['children'] as $iiOptIdx => $iiOpt) {
                                //if an option has jay's choices...
                                foreach ($itm['options'] as $jayOpt => $jayCh) {
                                    if($jayOpt == $iiOpt['id']) {
                                        foreach ($itemToInsert['children'][$iiOptIdx]['children'] as $iiChoiceIdx => $iiChoice) {
                                            if(in_array($iiChoice['id'], $jayCh)) {
                                                $itemToInsert['children'][$iiOptIdx]['children'][$iiChoiceIdx]['jay_choice'] = true;
                        }   }   }   }   }   }

                        break 2; // Break out back into $newData["menu"][$catIdx]['items']

            }   }   }
            
            // add the ordr.in data + rating + options
            $newData["menu"][$catIdx]['children'][] = $itemToInsert;//appropraite ordr.in item
            unset($newData['menu'][$catIdx]['items']);
    }   }

    mysqli_free_result($rest);
    mysqli_free_result($cats);
    mysqli_free_result($items);
    mysqli_close($db);

    echo json_encode($newData);

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
