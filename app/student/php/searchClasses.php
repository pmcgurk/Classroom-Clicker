<?php

include("../php/connect.php");
$value = $_GET['value'];
 $result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.description, classes.isvisible, owned.uid, users.realname FROM (enrolled) INNER JOIN (classes) ON (enrolled.cid = classes.cid) INNER JOIN (owned) ON (classes.cid = owned.cid) INNER JOIN (users) ON (owned.uid = users.uid) WHERE classes.code LIKE '%$value%'");
 $rows = array();
   while($r = mysql_fetch_assoc($result)) {
        $rows[] = $r;
   }

 print json_encode($rows);

?>