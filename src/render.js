import mobileTemplate from './src/templates/mobile.html!text'
import desktopTemplate from './src/templates/desktop.html!text'

import rp from 'request-promise'
import Mustache from 'mustache'
import fs from 'fs'
import mkdirp from 'mkdirp'
import cheerio from 'cheerio'

export async function render(assetPath) {
    let spreadsheet = JSON.parse(await rp("https://interactive.guim.co.uk/docsdata-test/1_YBBoPBQE4sBV5rCxh8AhaLNiU1kPlBY30qCkVmZZWE.json"));

    spreadsheet = cleanSpreadsheet(spreadsheet);

    cleanGraphics(assetPath, spreadsheet);

    var renderData = {
        "spreadsheet": spreadsheet
    };

    return Mustache.render(mobileTemplate, renderData) + Mustache.render(desktopTemplate, renderData);
}

function cleanGraphics(assetPath, spreadsheet) {
    let files = fs.readdirSync("./src/assets");
    let annotations = spreadsheet.annotations;

    files.forEach((f) => {
        if (f.substr(f.length - 4) === "html") {
            let file = fs.readFileSync("./src/assets/" + f, "utf8");
            let $ = cheerio.load(file);

            let artboardHtml = $.html(".g-artboard");

            let html = $.html($(".ai2html").html(artboardHtml));

            let cleanedHtml = html.replace(/background-image:url\(/g, "background-image:url(" + assetPath + "/assets/").replace(/\[\[/g, "{{").replace(/\]\]/g, "}}");

            cleanedHtml = Mustache.render(cleanedHtml, annotations);

            mkdirp("./.build/graphics/", function(err) {
                if (err) console.error(err)
                else fs.writeFileSync("./.build/graphics/" + f, cleanedHtml);
            });
        }
    });
}

function cleanSpreadsheet(spreadsheet) {
    //add end cards
    var advertCounter = 0;

    spreadsheet.stacks.map((stack, i) => {
        stack.number = i + 1;

        if (isEven(stack.number)) {
            advertCounter++;
            stack.advert = true;
            stack.advertCount = advertCounter;
        }

        stack.cards.unshift({
            "headerCard": true,
            "words": stack.headline
        });

        let nextStack = spreadsheet.stacks[i + 1];
        if (nextStack) {
            stack.nextStack = {
                "words": nextStack.headline
            };

            stack.cards[stack.cards.length - 1].endCard = true;

            stack.nextColor = nextStack.color;
        }
        return stack;
    });
    return spreadsheet;
}

function isEven(n) {
    n = Number(n);
    return n === 0 || !!(n && !(n % 2));
}
