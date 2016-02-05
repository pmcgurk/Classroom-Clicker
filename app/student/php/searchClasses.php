<?php

include("../php/connect.php");
$value = $_GET['value'];
session_start();
$uid    = $_SESSION['id'];
$result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.description, classes.isvisible, owned.uid, users.realname FROM (classes) INNER JOIN (owned) ON (classes.cid = owned.cid) INNER JOIN (users) ON (owned.uid = users.uid) WHERE classes.code LIKE '%$value%'");

$rows = array();
while ($r = mysql_fetch_assoc($result)) {
    $cid   = $r['cid'];
    $count = mysql_fetch_array(mysql_query("SELECT 1 FROM (enrolled) WHERE enrolled.cid = '$cid' AND enrolled.uid = '$uid'"));
    if ($count[0] == 0) {
        $rows[] = $r;
    }
}

print json_encode($rows);

?>