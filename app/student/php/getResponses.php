<?php

include("../php/connect.php");
session_start();
$uid = $_SESSION['id'];
$qid = $_GET['qid'];
$responses = mysql_query("SELECT count(*) as total FROM responses INNER JOIN (questions) on (responses.qid = questions.qid) WHERE responses.uid = $uid AND questions.qid = $qid");
$correctresponses = mysql_query("SELECT count(*) as correctresponses FROM responses INNER JOIN (questions) on (responses.qid = questions.qid) WHERE responses.uid = $uid AND questions.qid = $qid AND responses.value = questions.answer");
$r2 = mysql_fetch_assoc($correctresponses);
while($r = mysql_fetch_assoc($responses)) {
    $rows = array('total' => $r['total'], 'correctresponses' => $r2['correctresponses']);
}
print json_encode($rows);
?>