<?php

include("connect.php");
session_start();    
$uid = $_SESSION['id'];
if (isset($uid)) {
    $result = mysql_query("SELECT users.uid, users.isLecturer, users.realname, users.username FROM users WHERE users.uid = {$uid}") or die(mysql_error());
    $rows = array();
    while($r = mysql_fetch_assoc($result)) {
        $rows = $r;
    }
    print json_encode($rows);
} else {
    echo "null";
}

?>