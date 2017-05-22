import mobileTemplate from './src/templates/mobile.html!text'
import desktopTemplate from './src/templates/desktop.html!text'

import rp from 'request-promise'
import Mustache from 'mustache'

export async function render() {
	let spreadsheet = JSON.parse(await rp("https://interactive.guim.co.uk/docsdata-test/1_YBBoPBQE4sBV5rCxh8AhaLNiU1kPlBY30qCkVmZZWE.json"));
	var renderData = {"spreadsheet": spreadsheet};
	console.log(renderData)
    return Mustache.render(mobileTemplate, renderData) + Mustache.render(desktopTemplate, renderData);
}
