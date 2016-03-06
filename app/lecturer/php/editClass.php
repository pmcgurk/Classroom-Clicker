<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$name = $_POST['name'];
$code = $_POST['code'];
$description = $_POST['description'];
$isvisible = $_POST['isvisible'];
$joinable = $_POST['joinable'];
$removed = $_POST['removed'];

if (isset($_POST['cid'])) {
    $result = mysql_query("SELECT * FROM owned WHERE uid = '$uid' AND '$_POST[cid]'") or die(mysql_error());
    // checks to see if current session uid owns the class
    if($row = mysql_fetch_array($result)) {
        if (strcmp($removed, 'true') == 0) {
            // if it is set for removal, it deletes the class from the database
            mysql_query("DELETE FROM `classes` WHERE cid = $_POST[cid]");
            mysql_query("DELETE FROM `owned` WHERE cid= $_POST[cid]");
            echo "Deleted";
        } else {
            // else it modifies it with the new data.
            mysql_query("UPDATE `classes` SET `name` = '$name', `code` = '$code', `description` = '$description', `isvisible` = '$isvisible', `joinable` = '$joinable' WHERE `classes`.`cid` = $_POST[cid]") or die(mysql_error());
            echo "Edit";
        }
    } else {
        echo "not your class to edit.";
    }
} else {
    // insert new class into the database
    mysql_query("INSERT INTO `classes` (`cid`, `name`, `code`, `description`, `isvisible`, `joinable`) VALUES (NULL, '$name', '$code', '$description', '$isvisible', '$joinable')") or die(mysql_error());
    // insert the new classes cid into the database with the user id as owner
    mysql_query("INSERT INTO `owned` (`cid`, `uid`) VALUES (LAST_INSERT_ID(), '$uid')") or die(mysql_error());
}
?>