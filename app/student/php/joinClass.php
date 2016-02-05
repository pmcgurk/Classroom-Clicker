<?php
include("../php/connect.php");
session_start();
$uid = $_SESSION['id'];
$count = mysql_fetch_array(mysql_query("SELECT 1 FROM (`clicker`.`enrolled`) WHERE enrolled.cid = '$_GET[cid]' AND enrolled.uid = '$uid'"));
if ($count[0] == 0) {
    mysql_query ("INSERT INTO `clicker`.`enrolled` (`cid`, `uid`) VALUES ('$_GET[cid]', '$uid')") or die(mysql_error());
    echo "Successfully Enrolled.";
} else {
    echo "Already Enrolled.";
}
?>