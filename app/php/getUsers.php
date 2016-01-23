<?php

include("connect.php");
$result = mysql_query("SELECT * FROM users") or die(mysql_error());
echo "<users>";
while ($row = mysql_fetch_array($result)) {
    echo "<user>";
    echo "<uid>{$row[0]}</uid>";
    echo "<username>{$row[1]}</username>";
    echo "<islecturer>{$row[2]}</islecturer>";
    echo "<realname>{$row[3]}</realname>";
    echo "<password>{$row[4]}</password>";
    echo "</user>";
}
echo "</users>";

?>