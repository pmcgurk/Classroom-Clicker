<?php

include("../php/connect.php");
 $result = mysql_query("SELECT * FROM responses WHERE responses.qid = $_GET[qid]") or die(mysql_error());
 $rows = array();
   while($r = mysql_fetch_assoc($result)) {
        $rows[] = $r;
   }

 print json_encode($rows);

?>