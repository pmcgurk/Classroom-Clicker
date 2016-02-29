<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$type = $_POST['type'];
$message = $_POST['message'];
mysql_query ("INSERT INTO `log` (`lid`, `uid`, `type`, `message`, `time`) VALUES (NULL, '{$uid}', '$type', '$message', CURRENT_TIMESTAMP)") or die(mysql_error());
?>