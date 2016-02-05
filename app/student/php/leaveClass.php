<?php
include("../php/connect.php");
session_start();
$uid = $_SESSION['id'];
mysql_query ("DELETE FROM `clicker`.`enrolled` WHERE `enrolled`.`uid` = '{$uid}' AND `enrolled`.`cid` = '{$_GET[cid]}'") or die(mysql_error());
echo "Class Left";
?> 