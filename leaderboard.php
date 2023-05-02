<?php
    $serverName = "localhost";
    $username = "atteo";
    $dbname = "atteo";
    $password = "kX6fXFYL9Hoi2QcinJMf7Weq";
    try {
        $conn = new PDO("mysql:host=$serverName;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO:: ERRMODE_EXCEPTION);
        if($_SERVER["REQUEST_METHOD"] === "POST"){
            $nick = $_POST["nick"];
            $time = $_POST["time"];
            $scramble = $_POST["scramble"];
            $scramble = str_replace("'", "*", $scramble);
            $query = $conn->prepare("INSERT INTO rubiclock (nickname, time, scramble) VALUES ('$nick', $time, '$scramble')");
            $query->execute();
            echo "<script>location.href='leaderboard.php';</script>";
        }
        $query = $conn->prepare("SELECT time, nickname, scramble FROM rubiclock ORDER BY time");
        $query->execute();
        $array = array();
        foreach($query as $row){
            array_push($array, $row); 
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    include("html/leaderboard.html");
?>
<script>
    const data = <?php echo json_encode($array)?>;
    let list = document.querySelector("ol");
    for(let n = 0; n < Object.keys(data).length; n++){
        if (list.innerText.includes("No times set")) {
            list.innerHTML = "";
        }
        let entryContainer = document.createElement("li");
        let entry = document.createElement("p");
        entry.appendChild(document.createTextNode(data[n][1] + " | " + data[n][0] + " | " + data[n][2].replaceAll("*", "'").replaceAll(",", " ")));
        entryContainer.appendChild(entry)
        list.appendChild(entryContainer);
    }
</script>