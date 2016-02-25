<?php
include("connect.php");
$qid = $_GET['qid'];
$text = $_GET['text'];
$buttons = $_GET['buttons'];
$lid = $_GET['lid'];
$answer = $_GET['answer'];
$removed = $_GET['removed'];
$isvisible = $_GET['isvisible'];

if (strcmp($removed, 'true') == 0) {
    mysql_query ("DELETE FROM `clicker`.`questions` WHERE qid = $qid") or die(mysql_error());
    echo "deleted question";
} else if ($qid != "") {
    mysql_query("UPDATE `clicker`.`questions` SET `text` = '$text', `buttontype` = '$buttons', `answer` = '$answer', `isvisible` = '$isvisible' WHERE `questions`.`qid` = '$qid' ") or die(mysql_error());
    echo "updated question";
} else {
    mysql_query ("INSERT INTO `clicker`.`questions` (`qid`, `lid`, `text`, `buttontype`, `isvisible`, `answer`) VALUES (NULL, '$lid', '$text', '$buttons', '$isvisible', '$answer')") or die(mysql_error());
    echo "added question";
}
echo strcmp($removed, 'false');
?>