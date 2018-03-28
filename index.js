const citeBits = {
	GBIFCite: 'GBIF:  The Global Biodiversity Information Facility (2018) What is GBIF?. Available from: ',
	GBIFWeb: 'https://www.gbif.org/what-is-gbif',
	RedListCite: 'Red List:  IUCN 2017. IUCN Red List of Threatened Species. Version 2017-3 ',
	RedListWeb: 'http://www.iucnredlist.org',
	GettyCite: 'Photos are courtesy of:  Getty Images, copyright © 2017. All rights reserved ',
	GettyWeb: 'http://developers.gettyimages.com/en/',
	BackCite: "Animal mural background courtesy of Disney's Animal Kingdom, Rafiki's Planet Watch ",
	BackWeb: 'https://disneyworld.disney.go.com/attractions/animal-kingdom/conservation-station/'
};
const GBIF_API_URL = 'https://api.gbif.org/v1/species/search';
const Getty_API_URL = 'https://api.gettyimages.com/v3/search/images';
const ShyPic = `<img src='images/CameraShy.png' alt='Composite image of animals covering their faces' class='js-pic'/>`;
const oopsImage = [
				`<img src='images/OopsElephant.jpg' alt="Image of a baby elephant" class='js-error-pic'/>`,
				`<img src='images/OopsSeal.jpg' alt="Image of a baby seal" class='js-error-pic'/>`,
				`<img src='images/OopsBushBaby.jpg' alt="Image of two bush babies" class='js-error-pic'/>`,
				`<img src='images/OopsGiraffe.jpg' alt="Image of a baby giraffe" class='js-error-pic'/>`,
				`<img src='images/OopsHippo.jpg' alt="Image of Fiona the baby hippo born at the Cincinnati, Ohio zoo" class='js-error-pic'/>`,
				`<img src='images/OopsHowlerMonkey.jpg' alt="Image of a Howler monkey" class='js-error-pic'/>`,
				`<img src='images/OopsLemur.jpg' alt="Image of a lemur" class='js-error-pic'/>`,
				`<img src='images/OopsLeopard.jpg' alt="Image of a leopard" class='js-error-pic'/>`,
				`<img src='images/OopsOtters.jpg' alt="Image of two otters floating on their backs" class='js-error-pic'/>`,
				`<img src='images/OopsSloth.jpg' alt="Image of a sloth hanging upside down on a tree branch" class='js-error-pic'/>`,
				`<img src='images/OopsTiger.jpg' alt="Image of a tiger" class='js-error-pic'/>`,
				];
let searchItem = "" ;


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
	try {
		return `
			<li role="listitem">
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
	const GBIFresults = data.results.map((item) => generateResultStrings(item));
	$(".js-GBIF-results").html(GBIFresults);
	$('ul').prepend(
		`
			<h2 class="choice-list">Choose an animal</h2>
		`);
}


// GBIF non-return search entry
function handleErrorEntry() {
	shuffle(oopsImage);
	const oopsMsg = oopsImage[0];
	$('.js-GBIF-results').html("");
	$('.js-animal-results').html(oopsMsg);
	$('.js-animal-results').prepend(
		`
			<p class="js-error-msg">I AM NOT AN ANIMAL! Please, enter a different search term.</p>
		`);
	displayCitation();
	}


// verifies whether GBIF data is useable
function tryGBIFData(data) {
if (data.results.length == 0) {
		handleErrorEntry();
	}
	else {
		displayGBIFData(data);
	}	
}


// event listener for the form search
// will fire the GBIF api request
function handleSearchSubmit() {
	$(".js-search-form").submit( function(event) {
		event.preventDefault();
		const searchTarget = $(event.currentTarget).find('.js-query');
		searchItem = searchTarget.val();
		$(".js-animal-results").html('');
		$(".js-citation").html('');
		getGBIFData(searchItem, tryGBIFData);
	});
}


// scroll to information return
function scrollToDiv() {
    $("html, body").animate(
    {
      scrollTop: $('#Animal-results').offset().top
    }, 500);
 }


// event listener for the user's animal choice from the GBIF return
// will fire the 2)Red List and Getty api requests
function handleUserChoice() {
	$("#js-user-choice").on ('click', `.js-GBIF`, event => {
		event.preventDefault();
		const searchTarget = $(event.currentTarget);
		let userChoice = searchTarget.text();
		const commonName = searchTarget.closest('li').find('span').text();
		searchTarget.val(" ");
		getREDListData1(userChoice, gatherRed1Data);
		getRedListData2(userChoice, gatherRed2Data);
		getGettyPic(userChoice, commonName, gatherGettyData);
	});
}


// Red List narrative api call
function getREDListData1(userChoice, callback) {
	const REDList_API1_URL = `https://cors-anywhere.herokuapp.com/http://apiv3.iucnredlist.org/api/v3/species/narrative/${userChoice}` ;
	const query2 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
	};
	$.getJSON(REDList_API1_URL, query2, callback);
}


// Red List species api call
function getRedListData2(userChoice, callback) {
	const REDList_API2_URL = `https://cors-anywhere.herokuapp.com/http://apiv3.iucnredlist.org/api/v3/species/${userChoice}` ;
	const query3 = {
		token: 'c6859a594d43701e167990e0de23ef01db373871586e01c6dcfeb6fa996f9fab' ,
	};
	$.getJSON(REDList_API2_URL, query3, callback);	
}


// Getty pic api call
function getGettyPic(searchPhrase, commonName, callback) {
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


// 3 "gather" functions hold API returns
function gatherRed1Data(data) {
	Red1Nar = data;
	hasAPICompleted();
}


function gatherRed2Data(data) {
	Red2Spc = data;
	hasAPICompleted();
}


function gatherGettyData(data) {
	GettyPic = data;
	hasAPICompleted();
}


// verifies API returns
function hasAPICompleted() {
	if (Red1Nar && Red2Spc && GettyPic) {
		testRedList(Red1Nar, Red2Spc, GettyPic);
	}
}


// shuffles the oopsImage array
function shuffle(bits) {
  for (let a = bits.length - 1; a > 0; a--) {
    let b = Math.floor(Math.random() * (a + 1));
    [bits[a], bits[b]] = [bits[b], bits[a]];
  }
}


// renders error message when Red List data is missing
function displayMissingBits() {
	shuffle(oopsImage);
	const oopsMsg = oopsImage[0];
	$('.js-animal-results').html(oopsMsg);
	$('.js-animal-results').prepend(
		`
			<p class="js-error-msg">Hmmm, this animal has not been found in the database. Please, choose another animal from the list above or start a new search.</p>
		`
	);
	displayCitation();
}


// error handler for Red List API return
function testRedList(Red1Nar, Red2Spc, GettyPic) {
	if (Red1Nar.result.length == 0) {
		displayMissingBits()
	}
	else {
		displayAnimalBits(Red1Nar, Red2Spc, GettyPic)	 
	}
	scrollToDiv();
}


// maps the Getty array return
function generateAnimalInfo(pics) {
	return `
		<div class="js-pics">
			<img src="${pics.display_sizes[0].uri}" class="js-pic" alt="${pics.title}">
		</div>
	`;
}


// determines which endangerment category badge to display
function getCategoryText(data) {
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


// determines population trend return
function getPopulationText(data) {
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


// populates info in citation area
function generateCiteStrings(item) {
	return `
		<div class="cite-area">
			<h4 class="js-cite-title">Citations (and thanks to):</h4>
			<p class="cite-text cite1">${item.GBIFCite}<a href=${item.GBIFWeb} aria-label="link to Global Biodiversity Information Facility site" class="cite-web" target="_blank" rel="noopener noreferrer">${item.GBIFWeb}</a></p>
			<p class="cite-text cite2">${item.RedListCite}<a href=${item.RedListWeb} aria-label="link to Red List web page" class="cite-web" target="_blank" rel="noopener noreferrer">${item.RedListWeb}</a></p>
			<p class="cite-text cite3">${item.GettyCite}<a href=${item.GettyWeb} aria-label="link to Getty Images Developer site" class="cite-web" target="_blank" rel="noopener noreferrer">${item.GettyWeb}</a></p>
			<p class="cite-text cite4">${item.BackCite}</p>
			<a href=${item.BackWeb} aria-label="link to Disney's Animal Kingdom Rafiki's Planet Watch site" class="cite-web" target="_blank" rel="noopener noreferrer">${item.BackWeb}</a>
		</div>
	`;
}


// renders the citation area
function displayCitation() {
	let citationString = generateCiteStrings(citeBits);
	$('.js-citation').html(citationString);
}


// renders Red List data and Getty pic
function displayAnimalBits(Red1Nar, Red2Spc, GettyPic) {
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
				<h3 class="js-title js-first-title">YOUR ANIMAL</h3>
				<div class="js-info">${Red2Spc.result[0].main_common_name}</div>
			</div>
			<div class="js-scienName">
				<h3 class="js-title">SCIENTIFIC NAME</h3>
				<div class="js-info">${Red2Spc.result[0].scientific_name}</div>
			</div>
			<div class="js-category">
			 	<h3 class="js-title">VUNERABILITY LEVEL</h3>
				<div class="js-info">${vuCategory}</div>
			</div>
		 	<div class="js-population">
				<h3 class="js-title">POPULATION TREND</h3>
		 		<div class="js-info">${popTrend}</div>
		 	</div>
		 	<div class="js-geography">
		 		<h3 class="js-title"><button type="button" aria-label="button to expand or collapse geographic information" class="display-btn">READ</button>GEOGRAPHIC RANGE</h3>
		 		<div class="js-info collapse">${Red1Nar.result[0].geographicrange}</div>
		 	</div>
		 	<div class="js-habitat">
				<h3 class="js-title"><button type="button" aria-label="button to expand or collapse habitat information" class="display-btn">READ</button>HABITAT</h3>
		 		<div class="js-info collapse">${Red1Nar.result[0].habitat}</div>
		 	</div>
		 	<div class="js-threats">
				<h3 class="js-title"><button type="button" aria-label="button to expand or collapse threat information" class="display-btn">READ</button>THREATS</h3>
		 		<div class="js-info collapse">${Red1Nar.result[0].threats}</div>
		 	</div>
		 	<div class="js-conserv">
				<h3 class="js-title"><button type="button" aria-label="button to expand or collapse conservation information" class="display-btn">READ</button>CONSERVATION MEASURES</h3>
		 		<div class="js-info collapse">${Red1Nar.result[0].conservationmeasures}</div>
		 	</div>
		`
	);
	displayCitation();
}


// expand & collapse funcionality for large text returns
function showText() {
	$('.js-animal-results').on('click', function(event) {
		$(event.target).closest('div').find('.js-info').slideToggle('collapse');
		event.preventDefault();
	});
}


// master function
function launchThreatAPI() {
	handleSearchSubmit();
	handleUserChoice();
	showText();
}


$(launchThreatAPI);
