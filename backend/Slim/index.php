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

function getContext() {
    //Set stream options
    $opts = array(
      'http' => array('ignore_errors' => true)
    );

    //Create the stream context
    $context = stream_context_create($opts);

    return $context;
}
                
// Get Restaurant List (delivery zone)
///////////////////////////////////////////////////////////////////////////////////////////////////

$app->get('/rl/:zip/:city/:addr', function($zip, $city, $addr) {

    // Ordr.in Tree
    $reqUrl = RESTHOST . 'dl/ASAP/' . urlencode($zip) . '/' . urlencode($city) . '/' . urlencode($addr) . '?_auth=1,' . APIKEY;

    $ordrinRes = file_get_contents($reqUrl, false, getContext());

    if (strpos($http_response_header[0], "200")) {
        // if a 200 is returned from ordr.in, proceed with incorporating the Jcore stuff

        // need extra param to decode into assoc. arrays instead of objects
        $data = json_decode($ordrinRes, true);

        $db = openConnection();

        $query = "SELECT * FROM Restaurants WHERE rest_activated = 1";
        $rests = mysqli_query($db, $query);

        $restaurants = [];

        while ($row = mysqli_fetch_assoc($rests)) {
            foreach ($data as $key => $value) {
                if ($row['rest_id'] == $value['id']) {
                    $value['rating'] = $row['rest_rating'];
                    $value['filters'] = json_decode($row['filters']);
                    $restaurants[] = $value;
        }   }   }

        if (count($restaurants) == 0 ) {
            $restaurants['error'] = 'no restaurants found for this address';
        }

        mysqli_free_result($rests);
        mysqli_close($db);

        echo json_encode($restaurants);
    } else {
        //if ordr.in doesn't return 200, send back the ordrin error.
        echo $ordrinRes;
    }
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

    $reqUrl = RESTHOST . 'rd/' . urlencode($rid) . '?_auth=1,' . APIKEY;

    $ordrinRes = file_get_contents($reqUrl, false, getContext());

    if (strpos($http_response_header[0], "200")) {
        // if a 200 is returned from ordr.in, proceed with incorporating the Jcore stuff

        // need extra param to decode into assoc. arrays instead of objects
        $data = json_decode($ordrinRes, true);

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
                    if( isset($data['menu'][$oiCatIdx]['children']) ) {
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

                }   }   }   }

                // add the ordr.in data + rating + options
                $newData["menu"][$catIdx]['children'][] = $itemToInsert;//appropraite ordr.in item
                unset($newData['menu'][$catIdx]['items']);
        }   }

        mysqli_free_result($rest);
        mysqli_free_result($cats);
        mysqli_free_result($items);
        mysqli_close($db);

        echo json_encode($newData);

    } else {
        //if ordr.in doesn't return 200, send back the ordrin error.
        echo $ordrinRes;
    }


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

    $ordrinRes = file_get_contents($reqUrl, false, getContext());

    if (strpos($http_response_header[0], "200")) {
        // if a 200 is returned from ordr.in, proceed with incorporating the Jcore stuff

        echo $ordrinRes;
    } else {
        //if ordr.in doesn't return 200, send back the ordrin error.
        echo $ordrinRes;
    }
});

// Post Order
///////////////////////////////////////////////////////////////////////////////////////////////////
$app->post('/order/:rid', function($rid) use ($app) {
    $body = $app->request->getBody();

    $parsed = json_decode($body);

    // manually taking each value, just in case.
    $fields = array(
        'rid'             => $parsed->rid,
        'em'              => $parsed->em,
        'tray'            => $parsed->tray,
        'tip'             => $parsed->tip,
        'first_name'      => $parsed->first_name,
        'last_name'       => $parsed->last_name,
        'delivery_date'   => $parsed->delivery_date,
        'phone'           => $parsed->phone,
        'addr'            => $parsed->addr,
        'addr2'           => $parsed->addr2,
        'city'            => $parsed->city,
        'state'           => $parsed->state,
        'zip'             => $parsed->zip,
        'card_name'       => $parsed->card_name,
        'card_number'     => $parsed->card_number,
        'card_cvc'        => $parsed->card_cvc,
        'card_expiry'     => $parsed->card_expiry,
        'card_bill_addr'  => $parsed->card_bill_addr,
        'card_bill_addr2' => $parsed->card_bill_addr2,
        'card_bill_city'  => $parsed->card_bill_city,
        'card_bill_state' => $parsed->card_bill_state,
        'card_bill_zip'   => $parsed->card_bill_zip,
        'card_bill_phone' => $parsed->card_bill_phone
    );



    $postUrl = ORDERHOST . 'o/' . urlencode($rid) . '?_auth=1,'.APIKEY;

    // //url-ify the data for the POST
    $fields_string = '';
    foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
    rtrim($fields_string, '&');

    //open connection
    $ch = curl_init();

    //set the url, number of POST vars, POST data
    curl_setopt($ch,CURLOPT_URL, $postUrl);
    curl_setopt($ch,CURLOPT_POST, count($fields));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    //execute post
    $result = curl_exec($ch);

    echo $result;

    //close connection
    curl_close($ch);

});



$app->run();



// == USER STUFF ==

// * create account

// * get saved addresses (for user)

// * create new address

// * get saved CCs

// * create new CC

// * order history (?)

// * login call