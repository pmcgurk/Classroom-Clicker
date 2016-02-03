<?php

include("../php/connect.php");
session_start();    
$uid = $_SESSION['id'];
 $result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.description, classes.isvisible, owned.uid, users.realname FROM (enrolled) INNER JOIN (classes) ON (enrolled.cid = classes.cid) INNER JOIN (owned) ON (classes.cid = owned.cid) INNER JOIN (users) ON (owned.uid = users.uid) WHERE enrolled.uid = {$uid}");
 $rows = array();
   while($r = mysql_fetch_assoc($result)) {
        $rows[] = $r;
   }

 print json_encode($rows);

?>