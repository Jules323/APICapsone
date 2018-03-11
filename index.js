const GBIF_API_URL = 'http://api.gbif.org/v1/species/search';
const Getty_API_URL = 'https://api.gettyimages.com/v3/search/images';
let searchItem = "" ;


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
	return `
		<li>
			<a class="js-GBIF" href="#">${data.scientificName}</a>
			</br>
			<span class="js-animal">${data.vernacularNames[0].vernacularName}</span>
		</li>`;
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


function handleSearchSubmit() {
	$(".js-search-form").submit( function(event) {
		event.preventDefault();
		console.log('handleSubmit ran')
		const searchTarget = $(event.currentTarget).find('.js-query');
		searchItem = searchTarget.val();
		console.log(searchItem)
		searchTarget.val(" ");
		getGBIFData(searchItem, displayGBIFData);
	});
}


// function handleErrorEntry()
// // GBIF non-return search entry



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


function getREDListData1(userChoice, callback) {
	console.log('getREDListData1 ran')
	const REDList_API1_URL = `http://apiv3.iucnredlist.org/api/v3/species/narrative/${userChoice}` ;
	const query2 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
		};
	$.getJSON(REDList_API1_URL, query2, callback);
}


function getRedListData2(userChoice, callback) {
	console.log('getRedListData2 ran')
	const REDList_API2_URL = `http://apiv3.iucnredlist.org/api/v3/species/${userChoice}` ;
	const query3 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
		};
	$.getJSON(REDList_API2_URL, query3, callback);	
}


function getGettyPic(searchPhrase, commonName, callback) {
	console.log('getGettyPic ran')
	const settings = {
		url: Getty_API_URL,
		data: {
			phrase: searchPhrase + " " + commonName ,
			fields: 'id, title, preview, referral_destinations' ,
			sort_order: 'most_popular' ,
			page_size: '2' ,
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


function generateAnimalInfo(pics) {
	console.log('generateAnimalInfo ran')
	return `
		<div class="js-pics">
			<img src="${pics.display_sizes[0].uri}" class="js-pic" alt="${pics.title}">
		</div>
		`;
}


function getCategoryText(data) {
	console.log('getCategoryText ran')
	const category = `${Red2Spc.result[0].category}`;
	if (category == "EX") {
		return "Extinct";
	}
	else if (category == "EW") {
		return "Extinct In The Wild";
	}
	else if (category == "CR") {
		return "Critically Endangered";
	}
	else if (category == "EN") {
		return "Endangered";
	}
	else if (category == "VU") {
		return "Vunerable";
	}
	else if (category == "NT") {
		return "Near Threatened";
	}
	else if (category == "LC") {
		return "Least Concern";
	}
	else {
		return "Not Evaluated/Data Deficient";
	}
}


function displayAnimalBits(Red1Nar, Red2Spc, GettyPic) {
	console.log('displayAnimalBits ran')
	const bits = GettyPic.images.map((item) => generateAnimalInfo(item));
	$('.js-animal-results').html(bits);
	const vuCategory = getCategoryText(Red2Spc);
	$('.js-animal-results').prepend(
		`
		<div class="js-commonName">
			<h3 class="js-commonName-title">YOUR ANIMAL</h3>
			<div class"js-commonName-text">${Red2Spc.result[0].main_common_name}</div>
		</div>
		<div class="js-scienName">
			<h3 class="js-scienName-title">SCIENTIFIC NAME</h3>
			<div class="js-scienName-text">${Red2Spc.result[0].scientific_name}</div>
		</div>
		`);
	$('.js-animal-results').append(
		`
		<div class="js-category">
		 	<h3 class="js-category-title">VUNERABILITY LEVEL</h3>
			<div class="js-category-text">${vuCategory}</div>
		</div>
	 	<div class="js-population">
			<h3 class="js-population-title">POPULATION TREND</h3>
	 		<div class="js-population-text">${Red1Nar.result[0].populationtrend}</div>
	 	</div>
	 	<div class="js-geography">
	 		<h3 class="js-geography-title">GEOGRAPHIC RANGE</h3>
	 		<div class="js-geography-text">${Red1Nar.result[0].geographicrange}</div>
	 	</div>
	 	<div class="js-habitat">
			<h3 class="js-habitat-title">HABITAT</h3>
	 		<div class="js-habitat-text">${Red1Nar.result[0].habitat}</div>
	 	</div>
	 	<div class="js-threat">
			<h3 class="js-threat-title">THREATS</h3>
	 		<div class="js-threat-text">${Red1Nar.result[0].threats}</div>
	 	</div>
	 	<div class="js-conserv">
			<h3 class="js-conserv-title">CONSERVATION MEASURES</h3>
	 		<div class="js-conserve-text">${Red1Nar.result[0].conservationmeasures}</div>
	 	</div>
		`);
}


function launchThreatAPI() {
	handleSearchSubmit();
	handleUserChoice();
}


$(launchThreatAPI);
