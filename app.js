const apiKey = "at_nE50KXcPueML5SNPuClxDD5MfOlWz";
const ip = document.querySelector(".ip");
const loc = document.querySelector(".location");
const isp = document.querySelector(".isp");
const timezone = document.querySelector(".timezone");
const input = document.querySelector("#ip");
const submit = document.querySelector("header button");
const loader = document.querySelector(".loader")
const regex = new RegExp("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
let map = L.map("map");


submit.addEventListener("click", () => {
    if (!regex.test(input.value) && input.value !== "") {
        input.style.background = "red";
        return
    } else {
        mapIt(input.value)
        input.style.background = "white";
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (!regex.test(input.value) && input.value !== "") {
            input.style.background = "red";
            alert("Please enter a valid IP")
            return
        } else {
            mapIt(input.value)
            input.style.background = "white";
        }
    }
});

async function getData(newIP) {
    loader.classList.add("loading");
    let datas;
    if (regex.test(newIP)) {
        const response = await fetch("https://geo.ipify.org/api/v1?apiKey=" + apiKey + "&ipAddress=" + newIP);
        datas = await response.json();
    } else {
        const response = await fetch("https://geo.ipify.org/api/v1?apiKey=" + apiKey);
        datas = await response.json();
    }

    loader.classList.remove("loading");
    return datas;
}

function mapIt(newIP = "") {
    getData(newIP)
        .then(datas => {
            ip.innerText = datas.ip;
            loc.innerText = datas.location.city;
            isp.innerText = datas.isp;
            timezone.innerText = "UTC " + datas.location.timezone;

            //LEAFLET API

            map.setView([datas.location.lat, datas.location.lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([datas.location.lat, datas.location.lng]).addTo(map)
                .bindPopup('You are there!')
                .openPopup();
        })
}

mapIt();