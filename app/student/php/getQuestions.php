<?php

include("../php/connect.php");
session_start();
$uid = $_SESSION['id'];
$result = mysql_query("SELECT * FROM questions WHERE questions.lid=$_GET[lid]");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);

?>