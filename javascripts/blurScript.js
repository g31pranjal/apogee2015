//Change this to use the stack blur js file for cross compatibility and move the header and sidebar out.

$registerScreen=$('.registerScreen');
$mainCanvas=$('#mainCanvas');
$registerButton=$('#registerButton');
$sidebar=$('.sidebar');
$searchIcon=$('#searchIcon');
$navbar=$('.navbar');
$regForm=$('.regForm');
$closeIcon=$('.closeIcon');
$header=$('.header');
$registerForm=$('#registerForm');
$genderSelect=$('.genderSelect');
$registerFormbutton=$('.registerFormbutton');
$nameField=$('#nameField');
$emailField=$('#emailField');
$phoneField=$('#phoneField');
$collegeField=$('#collegeField');
$loginButton = $("#loginButton");
$logoutButton = $("#logoutButton");

isBlurOn = false;

$registerButton.click(function(event) {
	hideLoginModal();
	closeSearch();
	if(currentLargestContainer == "LANDING")
		showRegisterPage("Register");
	else
	{
		$(".largestContainer").fadeOut(300,function(){$("#landing").fadeIn(300,function(){showRegisterPage("Register");})});
	}
	currentLargestContainer = "LANDING";
});

function profileRefresh(obj) {
	$("#nameBlock").html(obj.name);
	$("#collegeBlock").html(obj.college);
	$("#eventBlock").html((obj.team_events.length + obj.normal_events.length));
	var nEvents = "";
	for(var i=0;i<obj.normal_events.length;i++){
		nEvents += '<div id="eventEntry" eventType="normal" eventID="'+obj.normal_events[i].id+'" event="'+obj.normal_events[i].name+'" class="eventEntry"><div id="eventContent">'+obj.normal_events[i].name+'</div><button id="removeEvent" class="removeEvent">REMOVE</button></div>'
	}
	for(var i=0;i<obj.team_events.length;i++){
		nEvents += '<div id="eventEntry" eventType="team" teamID="'+obj.team_events[i].code+'" eventID="'+obj.team_events[i].id+'" event="'+obj.team_events[i].name+'" class="eventEntry"><div id="eventContent">'+obj.team_events[i].name+'<br>Team Code : '+obj.team_events[i].code+'</div><button id="removeEvent" class="removeEvent">REMOVE</button></div>'
	}
	
	$("#individualEvents").html(nEvents);

	$(".removeEvent").click(function() {
		var value = $(this).parent().attr("eventID");
		value = {
			'id' : value
		};
		if( $(this).parent().attr("eventType") == "normal" ) {
			$.ajax({
				url : "http://bits-apogee.org/2015/registration/removenormalevent/" , 
				type : "POST" , 
				datatype : 'json' , 
				data : value , 
				success : function(data) {
					var obj = JSON.parse(data);
					if(obj.status == 1) {
						$.ajax({
							url: 'http://bits-apogee.org/2015/registration/profile/',
							type: 'GET',
							datatype : 'json' , 
							success : function(obj) {
								profileRefresh(obj);
								hideLoginModal();
								closeSearch();
								if(currentLargestContainer == "LANDING")
									showRegisterPage("profile");
								else
								{
									$(".largestContainer").fadeOut(300,function(){
										$("#landing").fadeIn(300,function(){
											showRegisterPage("profile");
										})
									});
								}
								currentLargestContainer = "LANDING";		
							}	
						});
					}
				}
			});
		}
		else {
			$.ajax({
				url : "http://bits-apogee.org/2015/registration/removeteamevent/" , 
				type : "POST" , 
				datatype : 'json' , 
				data : value , 
				success : function(data) {
					var obj = JSON.parse(data);
					if(obj.status == 1) {
						$.ajax({
							url: 'http://bits-apogee.org/2015/registration/profile/',
							type: 'GET',
							datatype : 'json' , 
							success : function(obj) {
								profileRefresh(obj);
								hideLoginModal();
								closeSearch();
								if(currentLargestContainer == "LANDING")
									showRegisterPage("profile");
								else
								{
									$(".largestContainer").fadeOut(300,function(){
										$("#landing").fadeIn(300,function(){
											showRegisterPage("profile");
										})
									});
								}
								currentLargestContainer = "LANDING";		
							}	
						});
					}
				}
			});
		}
	});


}

$('#profileButton').click(function(event) {
	if(loggedIn) {
		$.ajax({
			url: 'http://bits-apogee.org/2015/registration/profile/',
			type: 'GET',
			datatype : 'json' , 
			success : function(obj) {
				profileRefresh(obj);
				hideLoginModal();
				closeSearch();
				if(currentLargestContainer == "LANDING")
					showRegisterPage("profile");
				else
				{
					$(".largestContainer").fadeOut(300,function(){
						$("#landing").fadeIn(300,function(){
							showRegisterPage("profile");
						})
					});
				}
				currentLargestContainer = "LANDING";		
			}	
		});
	}
});

$closeIcon.click(function(event) {
	closeRegisterationPage();
});


function showRegisterPage(x){
	
	
	
	var i=0;
	
	
	$(".blurPageContent").css("display","none");
	$registerScreen.css({
		display: 'block',
		backgroundColor: 'rgba(10,10,10,0.1)'
	});
	
	if(x == "participation")
	{
		
		$(".participationForm").css("display","block");
		initialize();
		
	}
	else if(x == "contacts")
	{	$(".contactForm").css("display","block");
		
	}
	else if(x == "paperProj")
	{	$(".papersProjForm").css("display","block");
		
	}
	else if(x == "lectures")
	{	$(".lectureForm").css("display","block");
		
	}
	else if(x == "sponsors")
	{	$(".sponsorsForm").css("display","block");
		
	}
	else if(x == "profile")
	{	$(".profileForm").css("display","block");
		
	}
	else
	{	$(".regForm").css("display","block");
		
	}
	
	
	if(isBlurOn == false)
	{
		$loginButton.animate({left: '-850px'}, 1200);
		$logoutButton.animate({left: '-850px'}, 1200);
		$header.animate({left: '-600px'}, 1200,function(){
			$closeIcon.fadeIn('100');
		});
		$sidebar.animate({right: '-450px'}, 800);
		$searchIcon.animate({right: '-100px'}, 800);
		$navbar.animate({bottom: '30px',left:'100px'}, 600);
		
		//Setting up Blur
		var x=setInterval(function(){
		i=i+1;
		$mainCanvas.css({
		   'filter'         : 'blur('+i+'px)',
		   '-webkit-filter' : 'blur('+i+'px)',
		   '-moz-filter'    : 'blur('+i+'px)',
		   '-o-filter'      : 'blur('+i+'px)',
		   '-ms-filter'     : 'blur('+i+'px)'
		});
		if(i>=10)
			clearInterval(x);
		}, 30);
		isBlurOn = true;
	}
	//google.maps.event.trigger(window,'resize',{});
	$(".nano").nanoScroller();
}


$(".participationSwitch").click(function() {
	// overview - 1 , acco - 2 , reachPilani - 3
	if($(this).hasClass("inactive")) {
		var dat = $(this).attr("dat");
		$(".participationInner").fadeOut(200);
		$("."+dat+"Data").delay(500).fadeIn(400,function(){$(".nano").nanoScroller();});
		$(".participationSwitch").addClass("inactive").removeClass("active");
		$(this).removeClass("inactive").addClass("active");
	}
	$(this).removeClass("inactive");
	$(this).addClass("active");
});

$(".papersProjSwitch").click(function() {
	if($(this).hasClass("inactive")) {
		var dat = $(this).attr("dat");
		$(".papersProjInner").fadeOut(200);
		$("."+dat+"Data").delay(500).fadeIn(400);
		$(".papersProjSwitch").addClass("inactive").removeClass("active");
		$(this).removeClass("inactive").addClass("active");
	}
	$(this).removeClass("inactive");
	$(this).addClass("active");
	$(".nano").nanoScroller();
});

function closeRegisterationPage(){
	
	$("#navbar"+currentNavbar).toggleClass('activeNavbar');
	currentNavbar = 0;
	
	$closeIcon.css('display', 'none');
	var i=10;
	$registerScreen.css('display', 'none');
	var x=setInterval(function(){
		i=i-1;
		$mainCanvas.css({
		   'filter'         : 'blur('+i+'px)',
		   '-webkit-filter' : 'blur('+i+'px)',
		   '-moz-filter'    : 'blur('+i+'px)',
		   '-o-filter'      : 'blur('+i+'px)',
		   '-ms-filter'     : 'blur('+i+'px)'
		});
		if(i<=0)
			clearInterval(x);
	}, 30);
	$header.animate({left: '0px'}, 1000);
	$loginButton.animate({left: '250px'}, 1000);
	$logoutButton.animate({left: '250px'}, 1000);
	$sidebar.animate({right: '20px'}, 800);
	$searchIcon.animate({right: '30px'}, 800);
	$navbar.animate({bottom: '38px'}, 600);
	isBlurOn = false;
}


//Code to covert form to object
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//Code to select Male and Female
var currentGender=''; //initialize gender
$genderSelect.click(function(event) {
	var gender=$(this).attr('id');
	$genderSelect.css('border', '1px solid #fff');
	if(gender=='m'){
		currentGender='m';
		$(this).addClass('genderSelectActive');
		$('#f').removeClass('genderSelectActive');
	}
	else if(gender=='f'){
		currentGender='f';
		$(this).addClass('genderSelectActive');
		$('#m').removeClass('genderSelectActive');
	}
});


function convertRegform(){
	return $registerForm.serializeObject();
}

$registerFormbutton.click(function(event) {
	submitForm();
});

$("#registerForm :input").click(function(event) {
	$(this).css('border', '1px solid #fff');
});

function submitForm(){
	var e=0; //error
	var nameRegex = new RegExp("^[a-zA-Z ]*$");
	var phoneRegex = new RegExp("^[0-9]{10}$");
	var emailRegex = new RegExp ("^[^@]+@[^@]+\.[^@]+$");
	$("#registerForm :input").each(function() {
	   	if($(this).val() === ""){
	    	$(this).css('border', '1px solid #f55');
	    	e=1;
	   	}
	});
	if(currentGender===''){
		$genderSelect.css('border', '1px solid #f55');
		e=1;
	}

	if(!nameRegex.test($nameField.val())){
		$nameField.css('border', '1px solid #f55');
		e=1;
	}
	if(!emailRegex.test($emailField.val())){
		$emailField.css('border', '1px solid #f55');
		e=1;
	}
	if(!phoneRegex.test($phoneField.val())){
		$phoneField.css('border', '1px solid #f55');
		e=1;
	}

	if(!e){
		var x=convertRegform();
		x.gender=currentGender;
		$.ajax({
			url: 'http://bits-apogee.org/2015/registration/register/',
			type: 'post',
			data: x
		})
		.success(function(data) {
			console.log(data);
			showModal(1,400,400,'Your Registeration is successful. Your Login credentials have been mailed.','Ok. Got it.');
		});
	}
}