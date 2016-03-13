<?php
include("connect.php");
 
$result = mysql_query("SELECT responses.rid, responses.qid, responses.time, responses.value, questions.buttontype, questions.isvisible FROM `responses` INNER JOIN (questions) ON (responses.qid = questions.qid) WHERE responses.qid = $_GET[qid]") or die(mysql_error());
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);
?>