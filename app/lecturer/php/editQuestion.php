<?php
include("connect.php");
$qid = $_GET['qid'];
$text = $_GET['text'];
$buttons = $_GET['buttons'];
$answer = "A";
echo mysql_query("UPDATE `clicker`.`questions` SET `text` = '$text', `buttontype` = '$buttons', `answer` = '$answer', `isvisible` = 1 WHERE `questions`.`qid` = '$qid' ") or die(mysql_error());
?>