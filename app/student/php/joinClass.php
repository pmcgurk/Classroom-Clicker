<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$count = mysql_fetch_array(mysql_query("SELECT 1 FROM (`enrolled`) WHERE enrolled.cid = '$_POST[cid]' AND enrolled.uid = '$uid'"));
if ($count[0] == 0) {
    mysql_query ("INSERT INTO `enrolled` (`cid`, `uid`) VALUES ('$_POST[cid]', '$uid')") or die(mysql_error());
    echo "Successfully Enrolled.";
} else {
    echo "Already Enrolled.";
}
?>