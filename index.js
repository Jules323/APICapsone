const citeBits = {
	GBIFCite: 'GBIF:  The Global Biodiversity Information Facility (2018) What is GBIF?. Available from: ',
	GBIFWeb: 'https://www.gbif.org/what-is-gbif',
	RedListCite: 'Red List:  IUCN 2017. IUCN Red List of Threatened Species. Version 2017-3 ',
	RedListWeb: 'http://www.iucnredlist.org',
	GettyCite: 'All photo are courtesy of:  Getty Images, copyright © 2017. All rights reserved ',
	GettyWeb: 'http://developers.gettyimages.com/en/',
	BackCite: "Animal mural background courtesy of Disney's Animal Kingdom, Rafiki's Planet Watch ",
	BackWeb: 'https://disneyworld.disney.go.com/attractions/animal-kingdom/conservation-station/'
};
const GBIF_API_URL = 'http://api.gbif.org/v1/species/search';
const Getty_API_URL = 'https://api.gettyimages.com/v3/search/images';
let searchItem = "" ;
const ShyPic = `<img src='images/CameraShy.png' class='js-pic'/>`;


//GBIF API call to find the scientific name
function getGBIFData(searchString, callback) {
	console.log('getGBIFData ran')
	const query1 = {
		q: `${searchString}` ,
		limit: '5' ,
		rank: 'SPECIES' ,
		status: 'ACCEPTED' ,
		highertaxonKey: '104045725' ,
		nameType: 'SCIENTIFIC' ,
	};
	$.getJSON(GBIF_API_URL, query1, callback);
}


//GBIF return items for user choice
function generateResultStrings(data) {
	console.log('generateResultStrings ran');
	try {
		return `
			<li>
				<a class="js-GBIF" href="#">${data.scientificName}</a>
				</br>
				<span class="js-animal">${data.vernacularNames[0].vernacularName}</span>
			</li>`;
	} catch (e) {
		return '' ;
	}
}


//results to html
function displayGBIFData(data) {
	console.log('displayGBIFData ran')
	const GBIFresults = data.results.map((item) => generateResultStrings(item));
	$(".js-GBIF-results").html(GBIFresults);
	$('ul').prepend(
		`<h2 class="choice-list">Choose an animal</h2>
		`);
}


// event listener for the form search
// will fire the GBIF api request
function handleSearchSubmit() {
	$(".js-search-form").submit( function(event) {
		event.preventDefault();
		console.log('handleSubmit ran')
		const searchTarget = $(event.currentTarget).find('.js-query');
		searchItem = searchTarget.val();
		console.log(searchItem)
		$(".js-animal-results").html('');
		$(".js-citation").html('');
		getGBIFData(searchItem, displayGBIFData);
	});
}


// function handleErrorEntry()
// // GBIF non-return search entry


// event listener for the user's animal choice from the GBIF return
// will fire the 2)Red List and Getty api requests
function handleUserChoice() {
	$("#js-user-choice").on ('click', `.js-GBIF`, event => {
		console.log('handleUserChoice ran')
		const searchTarget = $(event.currentTarget);
		let userChoice = searchTarget.text();
		console.log(userChoice)
		const commonName = searchTarget.closest('li').find('span').text();
		searchTarget.val(" ");
		getREDListData1(userChoice, gatherRed1Data);
		getRedListData2(userChoice, gatherRed2Data);
		getGettyPic(userChoice, commonName, gatherGettyData);
	});
}

// Red List narrative api call
function getREDListData1(userChoice, callback) {
	console.log('getREDListData1 ran')
	const REDList_API1_URL = `http://apiv3.iucnredlist.org/api/v3/species/narrative/${userChoice}` ;
	const query2 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
		};
	$.getJSON(REDList_API1_URL, query2, callback);
}

// Red List species api call
function getRedListData2(userChoice, callback) {
	console.log('getRedListData2 ran')
	const REDList_API2_URL = `http://apiv3.iucnredlist.org/api/v3/species/${userChoice}` ;
	const query3 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
		};
	$.getJSON(REDList_API2_URL, query3, callback);	
}


// Getty pic api call
function getGettyPic(searchPhrase, commonName, callback) {
	console.log('getGettyPic ran')
	const settings = {
		url: Getty_API_URL,
		data: {
			phrase: searchPhrase + " " + commonName ,
			fields: 'id, title, preview, referral_destinations' ,
			sort_order: 'most_popular' ,
			page_size: '1' ,
		},
		dataType: 'json' ,
		type: 'GET' ,
		success: callback ,
		headers: {
		'API-Key': 'pe6mj7rne8urdbt5x7bwmff3' ,
		},
	};
	$.ajax(settings);
}


// 3 variables for api callback data
let Red1Nar = null ;
let Red2Spc = null ;
let GettyPic = null ;


//3 "gather" functions hold API returns
function gatherRed1Data(data) {
	console.log('gatherRed1Data ran')
	console.log(data)
	Red1Nar = data;
	hasAPICompleted();
}


function gatherRed2Data(data) {
	console.log('gatherRed2Data ran')
	console.log(data)
	Red2Spc = data;
	hasAPICompleted();
}


function gatherGettyData(data) {
	console.log('gatherGettyData ran')
	console.log(data)
	GettyPic = data;
	hasAPICompleted();
}


//verifies API returns
function hasAPICompleted() {
	if (Red1Nar && Red2Spc && GettyPic) {
	console.log('All APIs returned')
	displayAnimalBits(Red1Nar, Red2Spc, GettyPic);
	}
}


// maps the Getty array return
function generateAnimalInfo(pics) {
	console.log(pics)
	return `
		<div class="js-pics">
			<img src="${pics.display_sizes[0].uri}" class="js-pic" alt="${pics.title}">
		</div>
		`;
}


// determines which endangerment category
function getCategoryText(data) {
	console.log('getCategoryText ran')
	const category = `${Red2Spc.result[0].category}`;
	if (category == "EX") {
		return `
			<img src="images/extinct.png" alt="Extinct" class="badge" />
		`;
	}
	else if (category == "EW") {
		return `
			<img src="images/extinctWild.png" alt="Extinct In The wild" class="badge" />
		`;
	}
	else if (category == "CR") {
		return `
			<img src="images/criticallyEndangered.png" alt="Critically Endangered" class="badge" />
		`;
	}
	else if (category == "EN") {
		return `
			<img src="images/Endangered.png" alt="Endangered" class="badge" />
		`;
	}
	else if (category == "VU") {
		return `
			<img src="images/Vunerable.png" alt="Vunerable" class="badge" />
		`;
	}
	else if (category == "NT") {
		return `
			<img src="images/nearThreatened.png" alt="Near Threatened" class="badge" />
		`;
	}
	else if (category == "LC") {
		return `
			<img src="images/leastConcern.png" alt="Least Concern" class="badge" />
		`;
	}
	else {
		return `
			<img src="images/Unknown.png" alt="Unknown/Data Deficient" class="badge" />
		`;
	}
}


function getPopulationText(data) {
	console.log('getPopulationText ran')
	const popData = `${Red1Nar.result[0].populationtrend}`;
	if (popData == 'decreasing') {
		return `
				<p class="arrow">Decreasing<img src="images/redArrow.png" alt="Red arrow pointing down" /></p>
			`;
	}
	else if (popData == 'increasing') {
		return `
			<p class="arrow">Increasing<img src="images/greenArrow.png" alt="Green arrow pointing up" /></p>
		`;
	}
	else if (popData == 'stable') {
		return `
			<p class="arrow">Stable<img src="images/Stable.png" alt="Yellow bar indicating population stability" /></p>
			`;
	}
	else {
		return `
		<p class="arrow">Unknown<img src="images/questionMark.png" alt="Question Mark" /></p>
		`;
	}
}


function generateCiteStrings(item) {
	return `
			<div class="cite-area">
				<h4 class="js-cite-title">Citations:</h4>
				<p class="cite-text cite1">${item.GBIFCite}<a href=${item.GBIFWeb} class="cite-web" target="_blank">${item.GBIFWeb}</a></p>
				<p class="cite-text cite2">${item.RedListCite}<a href=${item.RedListWeb} class="cite-web" target="_blank">${item.RedListWeb}</a></p>
				<p class="cite-text cite3">${item.GettyCite}<a href=${item.GettyWeb} class="cite-web" target="_blank">${item.GettyWeb}</a></p>
				<p class="cite-text cite4">${item.BackCite}<a href=${item.BackWeb} class="cite-web" target="_blank">${item.BackWeb}</a></p>
			</div>
	`;
}


function displayCitation() {
	let citationString = generateCiteStrings(citeBits);
	$('.js-citation').html(citationString);
}


// renders Red List data and Getty pic
function displayAnimalBits(Red1Nar, Red2Spc, GettyPic) {
	console.log('displayAnimalBits ran')
	if (GettyPic.images.length == 0) {
		GettyPic = ShyPic;
		$('.js-animal-results').html(GettyPic);
	}
	else {
	const bits = GettyPic.images.map((index) => generateAnimalInfo(index));
	$('.js-animal-results').html(bits);
	}
	const vuCategory = getCategoryText(Red2Spc);
	const popTrend = getPopulationText(Red1Nar);
	$('.js-animal-results').append(
		`
		<div class="js-commonName">
			<h3 class="js-title">YOUR ANIMAL</h3>
			<div class="js-text">${Red2Spc.result[0].main_common_name}</div>
		</div>
		<div class="js-scienName">
			<h3 class="js-title">SCIENTIFIC NAME</h3>
			<div class="js-text">${Red2Spc.result[0].scientific_name}</div>
		</div>
		<div class="js-category">
		 	<h3 class="js-title">VUNERABILITY LEVEL</h3>
			<div class="js-text">${vuCategory}</div>
		</div>
	 	<div class="js-population">
			<h3 class="js-title">POPULATION TREND</h3>
	 		<div class="js-text">${popTrend}</div>
	 	</div>
	 	<div class="js-geography">
	 		<h3 class="js-title">GEOGRAPHIC RANGE</h3>
	 		<div class="js-text">${Red1Nar.result[0].geographicrange}</div>
	 	</div>
	 	<div class="js-habitat">
			<h3 class="js-title">HABITAT</h3>
	 		<div class="js-text">${Red1Nar.result[0].habitat}</div>
	 	</div>
	 	<div class="js-threat">
			<h3 class="js-title">THREATS</h3>
	 		<div class="js-text">${Red1Nar.result[0].threats}</div>
	 	</div>
	 	<div class="js-conserv">
			<h3 class="js-title">CONSERVATION MEASURES</h3>
	 		<div class="js-text">${Red1Nar.result[0].conservationmeasures}</div>
	 	</div>
		`);
	displayCitation();
}


// master function
function launchThreatAPI() {
	handleSearchSubmit();
	handleUserChoice();
}


$(launchThreatAPI);
