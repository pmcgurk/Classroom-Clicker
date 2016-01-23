<?php

include("connect.php");
 $result = mysql_query("SELECT classes.cid, classes.name, classes.code, classes.isvisible, users.realname FROM classes INNER JOIN (owned) ON (classes.cid=owned.cid) INNER JOIN (users) ON (owned.uid=users.uid) INNER JOIN (enrolled) ON (classes.cid=enrolled.cid)");
 $rows = array();
   while($r = mysql_fetch_assoc($result)) {
        $rows[] = $r;
   }

 print json_encode($rows);

?>