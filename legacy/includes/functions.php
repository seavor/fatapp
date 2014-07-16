<?php

function printR($data) {
	echo '<pre>';
	print_r($data);
	echo '</pre>';
}

function getItem($data, $iid) {
    foreach ($data['menu'] as $categoryIter) {
		foreach ($categoryIter['children'] as $itemIter) {
			if($itemIter['id'] == $iid) {
				return $itemIter;
			}
		}
	}
}

?>