<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$cid = $_POST['cid'];
$count = mysql_fetch_array(mysql_query("SELECT 1 FROM (`enrolled`) WHERE enrolled.cid = '$cid' AND enrolled.uid = '$uid'"));
if ($count[0] == 0) {
    echo "Error: you aren't enrolled in this class!";
} else {
    mysql_query ("DELETE FROM `enrolled` WHERE `enrolled`.`uid` = '{$uid}' AND `enrolled`.`cid` = '{$cid}'") or die(mysql_error());
    echo "Class Left";
}
?>