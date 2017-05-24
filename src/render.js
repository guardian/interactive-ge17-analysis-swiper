import mobileTemplate from './src/templates/mobile.html!text'
import desktopTemplate from './src/templates/desktop.html!text'

import rp from 'request-promise'
import Mustache from 'mustache'
import fs from 'fs'
import mkdirp from 'mkdirp'
import cheerio from 'cheerio'

export async function render(assetPath) {
    cleanGraphics(assetPath);
    let spreadsheet = JSON.parse(await rp("https://interactive.guim.co.uk/docsdata-test/1_YBBoPBQE4sBV5rCxh8AhaLNiU1kPlBY30qCkVmZZWE.json"));
    var renderData = {
        "spreadsheet": spreadsheet
    };

    let table = `<table style="width:100%">
          <tr>
            <th>Firstname</th>
            <th>Lastname</th> 
            <th>Age</th>
          </tr>
          <tr>
            <td>Jill</td>
            <td>Smith</td> 
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td> 
            <td>94</td>
          </tr>
        </table>`;


    let html = "";

    for(let i = 0; i < 1; i++) {
        html += table;
    }

    // return Mustache.render(mobileTemplate, renderData) + Mustache.render(desktopTemplate, renderData);

    return html;
}

function cleanGraphics(assetPath) {
    let files = fs.readdirSync("./src/assets");

    files.forEach((f) => {
        if (f.substr(f.length - 4) === "html") {
            let file = fs.readFileSync("./src/assets/" + f, "utf8");
            let $ = cheerio.load(file);
            console.log($.html(".g-artboard"));

            let artboardHtml = $.html(".g-artboard");

            let html = $.html($(".ai2html").html(artboardHtml));

            let cleanedHtml = html.replace(/background-image:url\(/g, "background-image:url(" + assetPath + "/assets/");

            mkdirp("./.build/graphics/", function(err) {
                if (err) console.error(err)
                else fs.writeFileSync("./.build/graphics/" + f, cleanedHtml);
            });
        }
    });
}
