<?php
include("../php/connect.php");
session_start();    
$uid = $_SESSION['id'];
$result = mysql_query("SELECT * FROM (classes) INNER JOIN (owned) ON (classes.cid = owned.cid) WHERE owned.uid = {$uid}");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);
?>