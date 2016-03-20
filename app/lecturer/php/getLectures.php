<?php
include("connect.php");
$result = mysql_query("SELECT lectures.lid, lectures.description, lectures.date, lectures.title, lectures.isvisible, classes.name FROM lectures INNER JOIN (classes) on (lectures.cid = classes.cid) WHERE lectures.cid=$_GET[cid] ORDER BY date ASC") or die(mysql_error());
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);
?>