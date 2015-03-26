/*Jquery Selectors*/
$sidebar=$('.sidebar');
$sidebarUl=$('.sidebarUl');
$navbar=$('.navbar');
$loader=$('.loader');

/*Initialization Script*/
/*  */

var categories=['DESIGN & BUILD','CODE & SIMULATE','AUTOMATION','PAPERS & PROJECTS','ONLINE EVENTS','ECONOMANIA','DEVELOP & DISCOVER','QUIZZES','MISCELLANEOUS'];
var navCategories=['EVENTS','PAPERS/PROJECTS','LECTURES','WORKSHOPS','CAMPUS AMBASSADOR','SPONSORS','CONTACTS','PARTICIPATION'];
initSidebar();
initNavbar();

var currentNavbar=0;
var currentLargestContainer = "LANDING";


function initSidebar(){
	$sidebar.append('<ul class="sidebarUl">');
	for(var i=1; i<categories.length; i++){
		$sidebarUl.append('<a href="#"><li class="sidebarCategories hvr-sweep-to-left">'+categories[i]+'</li></a>');
	}
}


function initNavbar(){
	for(var i=1; i<navCategories.length+1; i++){
		$navbar.append('<a href="#"  class="navbar-links" id="navbar'+i+'">'+navCategories[i-1]+'</a>');
	}
}

$(".apogeeLogo").click(function(){
	
	$("#navbar"+currentNavbar).toggleClass('activeNavbar');
	currentNavbar = 0;
	
	
	if(currentLargestContainer != "LANDING")
	{
		if(isSearchOn)
		{
			closeSearch();
			setTimeout(function(){$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300)});},250);
		}
		else
		{	$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300)});
		}
	}
	if(isBlurOn)
	{
		closeRegisterationPage();
		isBlurOn = false;
	}
	
	currentLargestContainer = "LANDING";
});
/*Code for current Navbar*/
$('.navbar-links').click(function(event) {
	
	//CHANGING THE HIGHLIGHTED NAV BUTTON
	if(currentNavbar!=0){
		$('#navbar'+currentNavbar).toggleClass('activeNavbar');
		$(this).toggleClass('activeNavbar');
	}
	else if(currentNavbar==0){
		$(this).toggleClass('activeNavbar');	
	}
	var str=$(this).attr('id');
	currentNavbar=str.substring(6);
	
	//HIDING EXTRA THINGS	
	hideLoginModal();
	closeSearch();
	//TAKING REAL ACTION
	if(navCategories[currentNavbar - 1] == "CONTACTS")
	{
		if(currentLargestContainer != "LANDING")
			$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300,function(){showRegisterPage("contacts");})});
		else
			showRegisterPage("contacts");
			
		currentLargestContainer = "LANDING";
	}

	else if(navCategories[currentNavbar - 1] == "SPONSORS")
	{
		if(currentLargestContainer != "LANDING")
			$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300,function(){showRegisterPage("sponsors");})});
		else
			showRegisterPage("sponsors");
			
		currentLargestContainer = "LANDING";
	}
	
	else if(navCategories[currentNavbar - 1] == "PAPERS/PROJECTS")
	{
		if(currentLargestContainer != "LANDING")
			$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300,function(){showRegisterPage("paperProj");})});
		else
			showRegisterPage("paperProj");
		
		currentLargestContainer = "LANDING";
	}
	
	else if(navCategories[currentNavbar - 1] == "LECTURES")
	{
		if(currentLargestContainer != "LANDING")
			$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300,function(){showRegisterPage("lectures");})});
		else
			showRegisterPage("lectures");
			
		currentLargestContainer = "LANDING";
	}
	
	else if(navCategories[currentNavbar - 1] == "PARTICIPATION")
	{
		google.maps.event.trigger(window,'resize',{});
		if(currentLargestContainer != "LANDING")
			$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300,function(){showRegisterPage("participation");})});
		else
			showRegisterPage("participation");
			
		currentLargestContainer = "LANDING";
	}
	
	else if(navCategories[currentNavbar - 1] == "EVENTS")
	{
		if(currentLargestContainer != "EVENTS")
		{
			$(".largestContainer").fadeOut(300,function(){$("#eventsWrapper").fadeIn(300)});
			closeRegisterationPage();
			currentLargestContainer = "EVENTS";
		}
		else
			closeSearch();
	}
	else if(navCategories[currentNavbar - 1] == "WORKSHOPS")
	{
		if(currentLargestContainer != "WORKSHOPS")
		{
			$(".largestContainer").fadeOut(300,function(){$("#workshopContainer").fadeIn(300)});
			closeRegisterationPage();
			currentLargestContainer = "WORKSHOPS";
		}
	}
	
	else if(navCategories[currentNavbar - 1] == "CAMPUS AMBASSADOR") {
		var win = window.open('http://bits-apogee.org/campus/', '_blank');
		$('#navbar'+currentNavbar).toggleClass('activeNavbar');
		currentNavbar = 0;
  		win.focus();
	}
	
});



/*Registeration Form Script*/

/*College Search Script*/
$collegeField=$('#collegeField');
$collegeSearch=$('.collegeSearch');
$collegeSearchBox=$('.collegeSearchBox');

var options = {
  keys: ['name', 'tag1', 'tag2', 'tag3', 'tag4', 'tag5'],   // keys to search in
};

var f = new Fuse(colleges, options);

$collegeField.keyup(function(event) {
	if($collegeField.val()==='')
		$('.hexagonLoader').fadeIn(600);
	else
		$('.hexagonLoader').fadeOut(600);
	$collegeSearchBox.html('');
	var results=f.search($collegeField.val());
	for (var i = 0; i < results.length; i++) {
		$collegeSearchBox.append('<div class="collegeSearchResults">'+results[i].name+'</div>');
	}
	$('.collegeSearchResults').click(function(event) {
		$collegeField.val($(this).html());
	});
});

//Put resize script here to make responsive on resize
$collegeField.focusin(function(event) {
	$collegeSearch.css({
		display: 'block',
	});
	$collegeSearch.animate({right: '0px'}, 400);
});

$collegeField.focusout(function(event) {
	var w=(-1*$collegeSearch.width()+'px');
	$collegeSearch.animate({
		right: w,
		},
		400, function() {
	});
});

/*Facebook Login API*/
function facebookLogin(){
	FB.login(function(response) {
		  if (response.status === 'connected') {
			  	FB.api('/me', function(response) {
					//console.log(JSON.stringify(response));
	    			personInfo = response;
					
					if(personInfo["last_name"] != undefined)
						document.getElementById("nameField").value = personInfo["first_name"] + " " + personInfo["last_name"];
					else
						document.getElementById("nameField").value = personInfo["first_name"];
					
					document.getElementById("emailField").value = personInfo["email"];
					
					if(personInfo["gender"] === "female")
						$('#f').trigger('click'); 
					else
						$('#m').trigger('click'); 
					//closeRegisterationPage();
				});
		    // Logged into your app and Facebook.
		  } else if (response.status === 'not_authorized') {
		    // The person is logged into Facebook, but not your app.
		  } else {
		    // The person is not logged into Facebook, so we're not sure if
		    // they are logged into this app or not.
		  }
	},{scope: 'public_profile,email'});
}

/* Google Login API */
function render() {
    gapi.signin.render('customBtn', {
		'clientid' : '415335897285-rtfmiij9s2ks94178jj09uq2d40hgcls.apps.googleusercontent.com',
		'scope' : 'https://www.googleapis.com/auth/plus.login',
		'redirecturi' : 'postmessage',
		'requestvisibleactions' : 'http://schema.org/AddAction',
		'cookiepolicy' : 'single_host_origin',
		'callback': 'onSignInCallback'
    });
} 
  
function onSignInCallback(resp) {
	gapi.client.load('plus', 'v1', apiClientLoaded);
}
  
function apiClientLoaded() {
	gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
}
  
function handleEmailResponse(resp) {
	//console.log(resp);
	//console.log(resp["displayName"]);
	
	if(resp["displayName"] != undefined)
		document.getElementById("nameField").value = resp["displayName"];
	
	if(resp["emails"] != undefined)
		if(resp["emails"][0]["value"] != undefined)
			document.getElementById("emailField").value = resp["emails"][0]["value"];
		
	if(resp["gender"] === "female")
		$('#f').trigger('click'); 
	else
		$('#m').trigger('click'); 
}


/*Navbar Script*/
currentNavbar=0;



