const GBIF_API_URL = 'http://api.gbif.org/v1/species/search';
let searchItem = "" ;
// const Getty_API_URL = 'https://api.gettyimages.com/v3/search/images';
// const REDList_API1_URL = `http://apiv3.iucnredlist.org/api/v3/species/narrative/${VAR1}`;
// const REDList_API2_URL = `http://apiv3.iucnredlist.org/api/v3/species/${VAR1}`;


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

// getGBIFData('animal', data => {
// 	console.log(data)
// })


//GBIF return items for user choice
function generateResultStrings(result) {
	console.log(result);
	return`
		<a class="js-GBIF" href="http://api.gbif.org/v1/species/search?q=${results}"
		</a>
		<br/><br/>`
}

//maps results to html
function displayGBIFData(data) {
	console.log(data)
	const GBIFresults = data.results.map((item) => generateResultStrings(results.scientificName));
	$('.js-GBIF-results').html(GBIFresults);
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

handleSearchSubmit()


// function handleErrorEntry()
// // GBIF non-return search entry

// function handleUserChoice()
// // for GBIF results


// function getREDListData1(searchName, callback) {
// 	const query2 = {
// 		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
// 		};
// 	$.getJSON(REDList_API1_URL, query2, callback);
// }

// getREDListData1('animal', data1 => {
// 	console.log(data1)
// })


// function getRedListData2(searchName,callback) {
// 	const query3 = {
// 		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
// 		};
// 	$.getJSON(REDList_API2_URL, query3, callback);	
// }

// getRedListData2('animal', data2 => {
// 	console.log(data2)
// })



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



// function gatherAnimalData()
// // hold call data until both have returned
// // use counter to trigger generateAnimalData

// function generateAnimalData()
// // for both REDList and Getty or separate?

// function displayAnimalData()

// function threatAPI()
	
