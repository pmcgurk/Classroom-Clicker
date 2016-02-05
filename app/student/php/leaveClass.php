<?php
include("../php/connect.php");
session_start();
$uid = $_SESSION['id'];
$count = mysql_fetch_array(mysql_query("SELECT 1 FROM (`clicker`.`enrolled`) WHERE enrolled.cid = '$_GET[cid]' AND enrolled.uid = '$uid'"));
if ($count[0] == 0) {
    echo "Error: you aren't enrolled in this class!";
} else {
    mysql_query ("DELETE FROM `clicker`.`enrolled` WHERE `enrolled`.`uid` = '{$uid}' AND `enrolled`.`cid` = '{$_GET[cid]}'") or die(mysql_error());
    echo "Class Left";
}

?>