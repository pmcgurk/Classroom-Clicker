<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$name = $_POST['name'];
$code = $_POST['code'];
$description = $_POST['description'];
$isvisible = $_POST['isvisible'];
$joinable = $_POST['joinable'];

if (isset($_POST['cid'])) {
    mysql_query("UPDATE `clicker`.`classes` SET `name` = '$name', `code` = '$code', `description` = '$description', `isvisible` = '$isvisible' WHERE `classes`.`cid` = $_POST[cid]") or die(mysql_error());
    echo "Edit";
} else {
    // insert new class into the database
    mysql_query("INSERT INTO `clicker`.`classes` (`cid`, `name`, `code`, `description`, `isvisible`, `joinable`) VALUES (NULL, '$name', '$code', '$description', '$isvisible', '$joinable')") or die(mysql_error());
    // insert the new classes cid into the database with the user id as owner
    mysql_query("INSERT INTO `clicker`.`owned` (`cid`, `uid`) VALUES (LAST_INSERT_ID(), '$uid')") or die(mysql_error());
}
?>