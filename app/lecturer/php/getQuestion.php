<?php
include("connect.php");
$result = mysql_query("SELECT * FROM questions INNER JOIN lectures ON (lectures.lid = questions.lid) WHERE questions.qid=$_GET[qid]");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows = $r;
}
print json_encode($rows);
?>