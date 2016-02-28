<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$name = $_POST['name'];
$date = $_POST['date'];
$description = $_POST['description'];
$isvisible = $_POST['isvisible'];
$removed = $_POST['removed'];
$cid = $_POST['cid'];

if (isset($_POST['lid'])) {
    $result = mysql_query("SELECT * FROM owned INNER JOIN (lectures) ON (owned.cid = lectures.cid) WHERE uid = $uid AND lectures.lid = $lid") or die(mysql_error());
    // checks to see if current session uid owns the class
    if($row = mysql_fetch_array($result)) {
        if (strcmp($removed, 'true') == 0) {
            // if it is set for removal, it deletes the class from the database
            mysql_query("DELETE FROM `clicker`.`lectures` WHERE lid = $_POST[lid]");
            echo "Deleted Lecture";
        } else {
            // else it modifies it with the new data.
            mysql_query("UPDATE `clicker`.`lectures` SET `title` = '$name', `description` = '$description', `isvisible` = '$isvisible', `date` = '$date' WHERE `lectures`.`lid` = $_POST[lid]") or die(mysql_error());
            echo "Edit";
        }
    } else {
        echo "Error: You don't own this class.";
    }
} else {
    $result = mysql_query("SELECT * FROM owned INNER JOIN (lectures) ON (owned.cid = lectures.cid) WHERE uid = $uid AND owned.cid = $cid") or die(mysql_error());
    if($row = mysql_fetch_array($result)) {
        mysql_query("INSERT INTO `clicker`.`lectures` (`lid`, `cid`, `title`, `date`, `description`, `isvisible`) VALUES (NULL, '$cid', '$name', '$date', '$description', '$isvisible')") or die(mysql_error());
    }
    else {
        echo "Error: You don't own this class.";
    }
}
?>