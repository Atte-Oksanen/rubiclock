export function checkTheme() {
    let params = new URLSearchParams(window.location.search);
    if (params.get("theme") == "dark") {
        document.querySelector("body").classList.add("dark");
        let links = document.getElementsByTagName("a");
        for(let n = 0; n < links.length; n++){
            if(!links[n].href.includes("#") && links[n].href.includes(window.location.hostname)){
                links[n].href = links[n].href + "?theme=dark";
            }
        }
        links = document.getElementsByTagName("form");
        for(let n = 0; n < links.length; n++){
            if(!links[n].action.includes("#") && links[n].action.includes(window.location.hostname)){
                links[n].action = links[n].action + "?theme=dark";
            }
        }
    }
}