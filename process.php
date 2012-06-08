<?php
function savePng($imageData) {
	$imageData = base64_decode($imageData);
	$fname = time() . ".png";
	$fh = fopen($fname, "wb");
	fwrite($fh, $imageData);
	fclose($fh);
	return $fname;
}
if(isset($GLOBALS["HTTP_RAW_POST_DATA"])) {
    $image = $GLOBALS["HTTP_RAW_POST_DATA"];
    $image = substr($image, strpos($image, ",") + 1);
    $fileName = savePng($image);
    echo $fileName;
}
?>
