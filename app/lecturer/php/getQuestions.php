<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$result = mysql_query("SELECT questions.text, questions.qid, questions.buttontype, questions.answer, questions.isvisible FROM questions INNER JOIN lectures ON (lectures.lid = questions.lid) WHERE questions.lid=$_GET[lid]");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);

?>