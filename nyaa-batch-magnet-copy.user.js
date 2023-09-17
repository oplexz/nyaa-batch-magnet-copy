// ==UserScript==
// @name         Nyaa Batch Magnet Copy
// @namespace    nyaa-batch-magnet-copy
// @version      0.1
// @description  take a batch of magnets from nyaa and copy them to clipboard with one click
// @author       Daniil Isakov <daniil.isakov@hotmail.com>
// @match        https://nyaa.si/*
// @icon         https://nyaa.si/static/favicon.png
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const tableHeader = document.querySelector("body > div > div.table-responsive > table > thead > tr");

    const th = document.createElement("th");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    th.appendChild(checkbox);
    tableHeader.insertBefore(th, tableHeader.firstChild);

    const items = document.querySelectorAll("body > div > div.table-responsive > table > tbody > tr");

    items.forEach((item) => {
        const td = document.createElement("td");
        td.classList.add("text-center");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        td.appendChild(checkbox);
        item.insertBefore(td, item.firstChild);
    });

    document.querySelector("body > div").insertAdjacentHTML(
        "afterbegin",
        `
        <div class="alert alert-info" role="alert">

            <button id="copyMagnets" type="button" class="btn btn-primary">Copy Magnets</button>

        </div>
    `
    );

    document.querySelector("#copyMagnets").addEventListener("click", () => {
        const selectedItems = document.querySelectorAll(
            "body > div > div.table-responsive > table > tbody > tr > td > input:checked"
        );
        const magnets = [];

        selectedItems.forEach((item) => {
            const magnet = item.parentElement.parentElement.querySelector("td:nth-child(4) > a:nth-child(2)").href;

            magnets.push(magnet);
        });

        navigator.clipboard.writeText(magnets.join("\n"));
        alert(`${magnets.length} magnet(s) copied!`);
    });

    checkbox.addEventListener("click", () => {
        const items = document.querySelectorAll("body > div > div.table-responsive > table > tbody > tr > td > input");

        items.forEach((item) => {
            item.checked = checkbox.checked;
        });
    });

    const checkboxes = document.querySelectorAll("body > div > div.table-responsive > table > tbody > tr > td > input");

    checkboxes.forEach((item) => {
        item.addEventListener("click", () => {
            const checkedItems = document.querySelectorAll(
                "body > div > div.table-responsive > table > tbody > tr > td > input:checked"
            );

            if (checkedItems.length === checkboxes.length) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    });

    let lastChecked;

    checkboxes.forEach((item) => {
        item.addEventListener("click", (e) => {
            if (e.shiftKey && lastChecked) {
                let inBetween = false;

                checkboxes.forEach((item) => {
                    if (item === e.target || item === lastChecked) {
                        inBetween = !inBetween;
                    }

                    if (inBetween) {
                        item.checked = true;
                    }
                });
            }

            lastChecked = e.target;
        });
    });
})();
