<?php
include("connect.php");
$result = mysql_query("SELECT * FROM lectures WHERE lectures.cid=$_GET[cid]") or die(mysql_error());
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}

print json_encode($rows);
?>