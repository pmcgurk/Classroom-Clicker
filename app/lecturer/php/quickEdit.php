<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$cid = $_POST['cid'];
$lid = $_POST['lid'];
$qid = $_POST['qid'];
$remove = 'false';
$isvisible = $_POST['isvisible'];

if (isset($cid)) {
    $result = mysql_query("SELECT * FROM owned WHERE uid = '$uid' AND '$cid'") or die(mysql_error());
    // checks to see if current session uid owns the class
    if($row = mysql_fetch_array($result)) {
        if (strcmp($removed, 'true') == 0) {
            // if it is set for removal, it deletes the class from the database
            mysql_query("DELETE FROM `classes` WHERE cid = $cid");
            mysql_query("DELETE FROM `owned` WHERE cid= $cid");
            echo "Deleted";
        } else {
            // else it modifies it with the new data.
            mysql_query("UPDATE `classes` SET `isvisible` = '$isvisible' WHERE `classes`.`cid` = $cid") or die(mysql_error());
            echo "Edited Class";
        }
    } else {
        echo "Error: You don't own this class.";
    }
} else if (isset($lid)) {
    $result = mysql_query("SELECT * FROM owned INNER JOIN (lectures) ON (owned.cid = lectures.cid) WHERE uid = $uid AND lectures.lid = $lid") or die(mysql_error());
    // checks to see if current session uid owns the class
    if($row = mysql_fetch_array($result)) {
        if (strcmp($removed, 'true') == 0) {
            // if it is set for removal, it deletes the class from the database
            mysql_query("DELETE FROM `lectures` WHERE lid = $lid");
            echo "Deleted Lecture";
        } else {
            // else it modifies it with the new data.
            mysql_query("UPDATE `lectures` SET `isvisible` = '$isvisible' WHERE `lectures`.`lid` = $lid") or die(mysql_error());
            echo "Edited Lecture";
        }
    } else {
        echo "Error: You don't own this class.";
    }
} else if (isset($qid)) {
    $result = mysql_query("SELECT * FROM owned INNER JOIN (lectures) ON (owned.cid = lectures.cid) INNER JOIN (questions) on (lectures.lid = questions.lid) WHERE uid = $uid AND questions.qid = $qid") or die(mysql_error());
    if($row = mysql_fetch_array($result)) {
        mysql_query("UPDATE `questions` SET `isvisible` = '$isvisible' WHERE `questions`.`qid` = '$qid' ") or die(mysql_error());
        echo "Edited Question";
    } else {
        echo "Error: You don't own this class.";
    }
}
?>