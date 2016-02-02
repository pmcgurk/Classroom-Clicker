<?php

include("connect.php");
session_start();    
$uid = $_SESSION['id'];
 $result = mysql_query("SELECT users.isLecturer FROM users WHERE users.uid = {$uid}") or die(mysql_error());
 $rows = array();
   while($r = mysql_fetch_assoc($result)) {
        $rows = $r;
   }

 print json_encode($rows);
?>