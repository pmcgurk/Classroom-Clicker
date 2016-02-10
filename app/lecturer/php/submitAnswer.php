<?php
include("connect.php");
$result = mysql_query("SELECT * FROM questions WHERE questions.qid=$_GET[qid] AND questions.answer='$_GET[value]'");
mysql_query ("INSERT INTO `clicker`.`responses` (`rid`, `uid`, `qid`, `time`, `value`) VALUES (NULL, '2', '$_GET[qid]', CURRENT_TIMESTAMP, '$_GET[value]')") or die(mysql_error());
if(mysql_num_rows($result) > 0 ) { 
    echo "correct";
}
else {
    echo 'incorrect';
}
?>