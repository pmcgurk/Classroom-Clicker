<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$qid = $_POST['qid'];
$result = mysql_query("SELECT * FROM owned INNER JOIN (lectures) ON (owned.cid = lectures.cid) INNER JOIN (questions) ON (questions.lid = lectures.lid) WHERE uid = $uid AND questions.qid = $qid") or die(mysql_error());
if($row = mysql_fetch_array($result)) {
    echo mysql_query("DELETE FROM `responses` WHERE responses.qid = $qid") or die(mysql_error());
} else {
    echo "Error: You don't own this class.";
}
?>