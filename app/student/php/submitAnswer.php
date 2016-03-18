<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
if(isset($uid)) {
    // finds all responses by the current user for the current question
    $result = mysql_query("SELECT * FROM responses WHERE responses.qid=$_GET[qid] AND responses.uid=$uid");
    if(mysql_num_rows($result) < 1) { 
        // if it is less than 1, i.e. no responses by the user, it inserts the response into the database.
        mysql_query ("INSERT INTO `responses` (`rid`, `uid`, `qid`, `time`, `value`) VALUES (NULL, '$uid', '$_GET[qid]', CURRENT_TIMESTAMP, '$_GET[value]')") or die(mysql_error());
        // it end checks if the question's answer is the value given
        $result2 = mysql_query("SELECT * FROM questions WHERE questions.qid=$_GET[qid] AND questions.answer='$_GET[value]'");
        $answerQuery = mysql_fetch_assoc(mysql_query("SELECT questions.answer FROM questions WHERE questions.qid=$_GET[qid]"));
        $answer = $answerQuery['answer'];
        // and then responds accordingly
        if(mysql_num_rows($result2) > 0 ) { 
            echo '{"response": "correct", "value": "'.$answer.'"}';
        }
        else {
            echo '{"response": "incorrect", "value": "'.$answer.'"}';
        }
    } else {
        // if it is more than or equal to 1, then there is already a response by this user.
        echo "You've already answered this questions.";
    }
} else {
    echo "Not logged in";
}
?>