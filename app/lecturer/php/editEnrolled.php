<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$removed = $_POST['removed'];
$cid = $_POST['cid'];
$suid = $_POST['uid'];

$result = mysql_query("SELECT * FROM owned WHERE uid = '$uid' AND '$cid'") or die(mysql_error());
// checks to see if current session uid owns the class
if($row = mysql_fetch_array($result)) {
    $result2 = mysql_query("SELECT * FROM enrolled WHERE uid = '$suid' AND '$cid'") or die(mysql_error());
    if($row2 = mysql_fetch_array($result2)) {
        // if it is set for removal, it deletes the class from the database
        echo mysql_query("DELETE FROM `enrolled` WHERE uid = '$suid' AND cid = '$cid'") or die(mysql_error());
        echo "deleted";
    } else {
        echo mysql_query("INSERT INTO `enrolled` (`uid`, `cid`) VALUES ('$suid', '$cid')") or die(mysql_error());
        echo "Inserted";
    }
} else {
    echo "not your class to edit.";
}

?>