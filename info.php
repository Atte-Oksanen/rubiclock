<?php
error_reporting(0);
try {
    require("html/info.html");
} catch (Error $e) {
    try {
        require("html/error.html");
    } catch (Error $e) {
        echo ($e->getMessage());
    }
}
?>