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
	Red1Nar = data;
	hasAPICompleted();
}


function gatherRed2Data(data) {
	console.log('gatherRed2Data ran')
	Red2Spc = data;
	hasAPICompleted();
}


function gatherGettyData(data) {
	console.log('gatherGettyData ran')
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
// ??MAYBE A FOREACH LOOP FOR IMAGES??
function generateAnimalInfo(pics) {
	console.log('generateAnimalInfo ran')
	return `
		<div class="js-pics">
			<img src="${pics.display_sizes[0].uri}" class="js-pic" alt="${pics.title}">
		</div>
		`;
}


function displayAnimalBits(Red1Nar, Red2Spc, GettyPic) {
	//console.log('displayAnimalData ran')
	console.log('displayAnimalBits ran')
	const bits = GettyPic.images.map((item) => generateAnimalInfo(item));
	$('.js-animal-results').html(bits);
	$('.js-animal-results').append(
		`<div class="js-catagory">${Red2Spc.result[0].category}</div>
		 <div class="js-population">${Red1Nar.result[0].populationtrend}</div>
		 <div class="js-geography">${Red1Nar.result[0].geographicrange}</div>
		 <div class="js-habitat">${Red1Nar.result[0].habitat}</div>
		 <div class="js-threat">${Red1Nar.result[0].threats}</div>
		 <div class="js-conserv">${Red1Nar.result[0].conservationmeasures}</div>`);
}


function launchThreatAPI() {
	handleSearchSubmit();
	handleUserChoice();
}


$(launchThreatAPI);
