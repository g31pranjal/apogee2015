$modalScreen=$('.modalScreen');
$modalBox=$('.modalBox');
$modalBoxButton=$('.modalBoxButton');
$modalBoxText=$('.modalBoxText');
$loginFormModal=$('#loginFormModal');
$loginButton=$('#loginButton');
$registerButton=$('#registerButton');
$logoutButton=$('#logoutButton');
$profileButton=$('#profileButton');
$loginButtonImg=$('#loginButton img');
$loginSubmit=$('#loginSubmit');
$loginForm=$('#loginForm');

var loginButtonActive=0;
var loggedIn=0;


$modalBoxButton.click(function(event) {
	hideModal(1,400,400);
});

$logoutButton.mouseenter(function() {
	$loginFormModal.fadeIn(200);
});

$logoutButton.mouseleave(function() {
	$loginFormModal.fadeOut(200);
});

$logoutButton.click(function() {
	if(loggedIn) {
		$.ajax({
			url : 'http://bits-apogee.org/2015/registration/logmeout/' ,
			cache:false ,
			type : "POST" ,
			success : function(data) {
				var obj = JSON.parse(data);
				if(obj.status == 1) {
					loggedIn = 0;
					$('#loginComment').html('You have successfully logged out !');
					$logoutButton.fadeOut(20);
					$profileButton.fadeOut(20);
					$loginButton.fadeIn(20);
					$registerButton.fadeIn(20);
					
					setTimeout(function() {
						$('#loginComment').html('');
						$loginForm.fadeIn(2);	
					}, 3000);
					
					loginButtonActive = 0;
				}
			}
		});
	}
});

$loginButton.click(function(event) {

	$loginFormModal.fadeToggle(400);
	$loginButtonImg.fadeToggle(200);
	if(loginButtonActive){
		loginButtonActive=0;
		$loginButton.css({
			backgroundColor: 'transparent',
			color: '#aaa'
		});
	}
	else{
		loginButtonActive=1;
		$loginButton.css({
			backgroundColor: 'rgb(240,240,240)',
			color: 'rgb(40,40,40)'
		});
	}
});

$loginSubmit.click(function(event) {
	submitLoginForm();	
});

function submitLoginForm(){
	var e=0; //error
	$("#loginForm :input").each(function() {
	   	if($(this).val() === ""){
	    	$(this).css('border', '1px solid #f55');
	    	e=1;
	   	}
	});

	if(!e){
		var x=$loginForm.serialize();
		$.ajax({
			url: 'http://bits-apogee.org/2015/registration/login/',
			type: 'post',
			cache:false,
			data: x
		})
		.success(function(data) {
			dataObject=JSON.parse(data);
			if(dataObject.status == '1') {
				$loginForm.fadeOut(200);
				$('#loginComment').html('You have successfully logged in '+dataObject.name+'');
				loggedIn = 1;
				$loginButton.fadeOut(20);
				$registerButton.fadeOut(20);
				$logoutButton.fadeIn(20);
				$profileButton.fadeIn(20);
				$loginFormModal.delay(2000).fadeOut(200);			
				$loginButtonImg.fadeToggle(200);
				$loginButton.css({
					backgroundColor: 'transparent',
					color: '#aaa'
				});
			}
			else{ 
				$("#loginComment").html('Invalid credentials !');
			 }
			//showModal(1,400,400,'Your Registeration is successful. Your username and password has been mailed. You will now be redirected to Event Portal.','Ok. Got it.');
		});
	}

}

function showModal(effect,screenTime,modalTime,modalText,buttonText){
	$modalBoxText.html(modalText);
	$modalBoxButton.html(buttonText);
	if(effect==1){
		$modalScreen.fadeIn(screenTime, function() {
			$modalBox.fadeIn(modalTime);
		});
	}
}

function hideModal(effect,screenTime,modalTime){
	if(effect==1){
		$modalBox.fadeOut(modalTime, function() {
			$modalScreen.fadeOut(screenTime);
		});
	}
}

function showLoginModal(){
	$loginFormModal.fadeIn(400);
}

function hideLoginModal(){
	$loginFormModal.fadeOut(400);
	$loginButtonImg.fadeOut(200);
	loginButtonActive=0;
		$loginButton.css({
			backgroundColor: 'transparent',
			color: '#aaa'
		});
}

