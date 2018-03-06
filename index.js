const GBIF_API_URL = 'http://api.gbif.org/v1/species/search';
let searchItem = "" ;
let userChoice = "" ;
const Getty_API_URL = 'https://api.gettyimages.com/v3/search/images';



//GBIF API call to find the scientific name
function getGBIFData(searchString, callback) {
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
	console.log(data);
	return`
		<br/>
		<li><a class="js-GBIF" href='#'>${data.scientificName}</a></li>
		<br/>`
}


//maps results to html
function displayGBIFData(data) {
	console.log(data)
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


function getREDListData1(userChoice, callback) {
	const query2 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
		};
	$.getJSON(REDList_API1_URL, query2, callback);
}


function getRedListData2(searchName,callback) {
	const query3 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
		};
	$.getJSON(REDList_API2_URL, query3, callback);	
}


function handleUserChoice() {
	$("#js-user-choice").on ('click', `.js-GBIF`, event => {
		console.log('handleUserChoice ran')
		const searchTarget = $(event.currentTarget);
		userChoice = searchTarget.text();
		console.log(userChoice)
		searchTarget.val(" ");
		// getREDListData1(userChoice, gatherAnimalData);
		// getRedListData2(userChoice, gatherAnimalData);
		//getGettyPic(userChoice, gatherAnimalData);
	});
}


// function getGettyPic(searchPhrase, callback) {
// 	const settings = {
// 		url: getty_API_URL,
// 		data: {
// 			phrase: `Arctictis binturong` ,
// 			fields: 'id, title, preview, referral_destinations' ,
// 			sort_order: 'most_popular' ,
// 			page_size: '2' ,
// 		},
// 		dataType: 'json' ,
// 		type: 'GET' ,
// 		success: callback ,
// 		headers: {
// 		'API-Key': 'pe6mj7rne8urdbt5x7bwmff3' ,
// 		},
// 	};
// 	$.ajax(settings);
// }

// getGettyPic('animal', data => {
// 	console.log(data)
// })


// hold call data until both have returned
// use counter to trigger displayAnimalData
// function gatherAnimalData()

// function generateAnimalData()
// // for both REDList and Getty or separate?

// function displayAnimalData()


function launchThreatAPI() {
	handleSearchSubmit();
	handleUserChoice();
}


$(launchThreatAPI);
