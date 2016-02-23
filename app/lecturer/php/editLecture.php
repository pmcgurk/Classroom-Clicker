<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
$name = $_POST['name'];
$date = $_POST['date'];
$description = $_POST['description'];
$isvisible = $_POST['isvisible'];
$removed = $_POST['removed'];

if (isset($_POST['lid'])) {
    //TODO add security to lid edit
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
    echo "new";
}
?>