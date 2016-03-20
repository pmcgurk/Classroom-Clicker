<?php
include("connect.php");
session_start();
$qid = $_GET['qid'];
$text = mysql_real_escape_string($_GET['text']);
$buttons = mysql_real_escape_string($_GET['buttons']);
$lid = $_GET['lid'];
$answer = mysql_real_escape_string($_GET['answer']);
$removed = $_GET['removed'];
$isvisible = $_GET['isvisible'];
$uid = $_SESSION['id'];

$result = mysql_query("SELECT * FROM owned INNER JOIN (lectures) ON (owned.cid = lectures.cid) WHERE uid = $uid AND lectures.lid = $lid") or die(mysql_error());
// checks to see if current session uid owns the class
if($row = mysql_fetch_array($result)) {
    if (strcmp($removed, 'true') == 0) {
        mysql_query ("DELETE FROM `questions` WHERE qid = $qid") or die(mysql_error());
        echo "deleted question";
    } else if ($qid != "") {
        mysql_query("UPDATE `questions` SET `text` = '$text', `buttontype` = '$buttons', `answer` = '$answer', `isvisible` = '$isvisible' WHERE `questions`.`qid` = '$qid' ") or die(mysql_error());
        echo "updated question";
    } else {
        mysql_query ("INSERT INTO `questions` (`qid`, `lid`, `text`, `buttontype`, `isvisible`, `answer`) VALUES (NULL, '$lid', '$text', '$buttons', '$isvisible', '$answer')") or die(mysql_error());
        echo "added question";
    }
} else {
    echo "Error: You don't own this class.";
}
?>