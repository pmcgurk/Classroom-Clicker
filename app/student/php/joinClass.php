<?php
include("../php/connect.php");
session_start();
$uid = $_SESSION['id'];
mysql_query ("INSERT INTO `clicker`.`enrolled` (`cid`, `uid`) VALUES ('$_GET[cid]', '$uid')") or die(mysql_error());
echo "success?";
?> 