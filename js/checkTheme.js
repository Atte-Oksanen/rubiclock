window.onload = () => {
    let params = new URLSearchParams(window.location.search);
    if (params.get("theme") == "dark") {
        document.querySelector("body").classList.add("dark");
        let links = document.getElementsByTagName("a");
        for(let n = 0; n < links.length; n++){
            if(!links[n].href.includes("#")){
                links[n].href = links[n].href + "?theme=dark";
            }
        }
    }
}