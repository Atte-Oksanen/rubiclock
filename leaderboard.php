<?php
    $creds = parse_ini_file("../credentials.ini");
    $serverName = $creds["servername"];
    $username = $creds["username"];
    $dbname = $creds["dbname"];
    $password = $creds["password"];
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
        die();
    }
    include("html/leaderboard.html");
?>
<script>
    const data = <?php echo json_encode($array)?>;
    let table = document.querySelector("table");
    for(let n = 0; n < Object.keys(data).length; n++){
        if (table.innerText.includes("No times set")) {
            table.innerHTML = "";
        }
        let entryContainer = document.createElement("tr");
        let nick = document.createElement("td");
        let time = document.createElement("td");
        let scramble = document.createElement("td");
        nick.appendChild(document.createTextNode(data[n][1]));
        time.appendChild(document.createTextNode(data[n][0]));
        scramble.appendChild(document.createTextNode(data[n][2].replaceAll("*", "'").replaceAll(",", " ")));
        entryContainer.appendChild(nick);
        entryContainer.appendChild(time);
        entryContainer.appendChild(scramble);
        table.appendChild(entryContainer);
    }
</script>