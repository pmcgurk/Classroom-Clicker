<?php
include("connect.php");
session_start();    
$uid = $_SESSION['id'];
$cid = $_GET['cid'];
$result = mysql_query("SELECT * FROM owned WHERE uid = '$uid' AND '$cid'") or die(mysql_error());
// checks to see if current session uid owns the class
if($row = mysql_fetch_array($result)) {
    $result = mysql_query("SELECT users.uid, users.username, users.realname, enrolled.cid FROM (enrolled) inner join (owned) ON (enrolled.cid = owned.cid) INNER JOIN (users) ON (enrolled.uid = users.uid) WHERE enrolled.cid = $cid");
    $rows = array();
    while($r = mysql_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
    echo "Error Accessing Enrolled students: Not authorised.";
}
?>