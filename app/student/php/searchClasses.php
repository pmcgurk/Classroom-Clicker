<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
if(isset($_GET['code'])) {
    $value = $_GET['code'];
    $result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.description, classes.isvisible, owned.uid, users.realname FROM (classes) INNER JOIN (owned) ON (classes.cid = owned.cid) INNER JOIN (users) ON (owned.uid = users.uid) WHERE classes.code LIKE '%$value%'");
} else if(isset($_GET['lecturer'])) {
    $value = $_GET['lecturer'];
    $result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.description, classes.isvisible, owned.uid, users.realname FROM (classes) INNER JOIN (owned) ON (classes.cid = owned.cid) INNER JOIN (users) ON (owned.uid = users.uid) WHERE users.realname LIKE '%$value%'");
} else if(isset($_GET['name'])) {
    $value = $_GET['name'];
    $result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.description, classes.isvisible, owned.uid, users.realname FROM (classes) INNER JOIN (owned) ON (classes.cid = owned.cid) INNER JOIN (users) ON (owned.uid = users.uid) WHERE classes.name LIKE '%$value%'");
}
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