var isLightBoxOn = false;
var isSearchOn = false;
var isInsideSearchDiv = false;
var wasSearchClosedByLB = false;
var noOfDummyEvents = 5;
var noOfColumns = 9;
var currLBRow = 0;
var eventInfo;
var events,requiredEventList;
var currEvent = "";
var currEventInfo;
var eventRow;

var searchRandomOptions = {	keys: ['name','tag1','tag2','tag3','tag4','tag5','tag6','tag7','tag8','tag9','tag10','tag11','tag12','tag13','tag14','tag15','tag16','tag17','tag18','tag19','tag20'],threshold:0.5};
var searchRandomObject = new Fuse(events, searchRandomOptions);
var searchCategoryOptions = { keys: ['category'],threshold:0.1};
var searchCategoryObject = new Fuse(events, searchCategoryOptions);
var searchKernelOptions = { keys: ['kernel']};
var searchKernelObject = new Fuse(events, searchKernelOptions);

var highResLoaded = false;
var areImagesLoaded = false;
var areWorkshopImagesLoaded = false;
var ajaxDone = false;

window.onload = function ()
{
	loadEventsData();								//Load All Events Data
	addLightBox();									//Add light box First in List
	addLightboxFunc();								//Add button Functions 
	setUpSearchRandom();							//Set up Search Side Bar
	paperProj();
	workshop();
	
}

window.onresize = function()
{
	finallyRenderLighbox();
}

function loadEventsData()
{
		$.ajax({
            url: 'http://bits-apogee.org/2015/events/all/',
            type: 'GET',
            dataType: 'json',
            cache:false,
        })
        .success(function(e) {
			events = e.Events;
			//console.log("All Events Data received..Time To load Images");
			loadEventImages();
			requiredEventList = events;	
			renderInitialEventPage();
			addListen();
			searchRandomObject = new Fuse(events, searchRandomOptions);
			searchCategoryObject = new Fuse(events, searchCategoryOptions);
			searchKernelObject = new Fuse(events, searchKernelOptions);
        });
}

function loadEventImages()
{
	var i;
	var count = 0;
	for(i=0; i<events.length; i++)
	{
			var theImage = new Image();
			
			$(theImage).load(function() {
				// The image has loaded (from cache, or just now)
				// ...do something with the fact the image loaded...
				count++;
				if(0.9 <= (count/events.length))
				{
					areImagesLoaded = true;
					//console.log("Events Images Loaded....Time to remove Loader");
					removeMainLoader();
				}
			});
			theImage.src = "./images/events/"+events[i]["name"]+".jpg";
			//console.log(events[i]["name"]+" Loaded"+ i);
	}
}

//===========================================================EVENTS PAGE========================================
function renderInitialEventPage()
{
	var i;
	for(i=0; i<events.length; i++)
	{
		$("#eventsContainer").append("<div id='event"+(i+1)+"' class='event'></div>");
		$("#event"+(i+1)).append("<div class='eventName'>"+events[i]["name"]+"</div>");
		if(events[i]["kernel"] == 1)
		{	$("#event"+(i+1)).append("<img class='kernelIcon' src='./images/icons/iconKernel.png' />");
		}
		$("#event"+(i+1)).css("background-image","url('./images/events/"+events[i]["name"]+".jpg')");
	}
	for(i=0; i<8; i++)
	{
		$("#eventsContainer").append("<div class='dummy'></div>");
	}
}

function addListen()
{
	var i = 0;
	for(i=0; i<events.length; i++)
	{
		$("#event"+(i+1)).click(function(event){
			showLightBox(event.target.id);
		});
	}
}

function showReqEvents()
{
	$(".event").css("display","none");
	var i = 0;
	var eventIDno;
	for(i=requiredEventList.length - 1; i>=0; i--)
	{
		eventIDno = requiredEventList[i]["sno"];
		$("#eventsContainer").prepend($("#event"+eventIDno));
		$("#event"+eventIDno).css("display","block");
		addLightBox();
		currLBRow = 0;
	}
}

//============================================================LIGHTBOX============================================

function addLightBox()
{
	$("#eventsContainer").prepend($("#lightBox"));
}

function showLightBox(divID)
{
	//=================EMPTY PREVIOUS INFO
	document.getElementById("infoHeader").innerHTML = "";
	document.getElementById("info").innerHTML = "";
	$('.tab').remove();
	
	//======Place LightBox in correct DOM Position
	var i = 0;
	var eventNumber = parseInt(divID.substring(5));
	for(i=0; i<requiredEventList.length; i++)
	{
		if(eventNumber == requiredEventList[i]["sno"])
		{
			break;
		}
	}
	eventRow = Math.ceil((i + 1)/noOfColumns);
	currEvent = requiredEventList[i]["id"];
	
	var temp = $("#lightBox");
	document.getElementById("lightBox").remove();
	if((eventRow*noOfColumns) < events.length)
		$("#eventsContainer :nth-child("+(eventRow*noOfColumns)+")").after(temp);
	else
		$("#eventsContainer :nth-child("+events.length+")").after(temp);
	currLBRow = eventRow;

	//=======Starting to add Data in Light Box
	$("#eventImageWrapper").css("background-image","url('./images/events/Highres/"+requiredEventList[i]["name"]+".jpg')");
	document.getElementById("eventName").innerHTML = requiredEventList[i]["name"];
	
	isLightBoxOn = true;
	$('#eventsLoader').fadeIn(300);
	$.ajax({
            url: 'http://bits-apogee.org/2015/events/ged/',
            type: 'POST',
            dataType: 'json',
            cache:false,
            data: {id:requiredEventList[i]["id"]},
        })
        .success(function(e) {
			//console.log("Asking Data for id:"+requiredEventList[i]["id"]+" name:"+requiredEventList[i]["name"])
			currEventInfo = e;
			var theImage = new Image();
			$(theImage).load(function() {
				// The image has loaded (from cache, or just now)
				// ...do something with the fact the image loaded...
				//console.log("img loaded");
				highResLoaded = true;
				openLightBox();
				
			});
			theImage.src = "./images/events/Highres/"+requiredEventList[i]["name"]+".jpg";
			renderInfo();
        });

	/* if(isSearchOn)
	{
		$('#search').animate({right:"-290px"},220);
		isSearchOn = false;
		setTimeout(function(){
			$("#lightBox").animate({height:"70%"},500);
			$('#events').animate({scrollTop:(eventRow-1)*window.innerHeight*0.2 + 10}, '500');},220);
		setTimeout(function(){$(".nano").nanoScroller();},725);
		wasSearchClosedByLB = true;
	}
	else
	{
		$("#lightBox").animate({height:"70%"},500);
		$('#events').animate({scrollTop:(eventRow-1)*window.innerHeight*0.2 + 10}, '500');
		setTimeout(function(){$(".nano").nanoScroller();},505);
	} */
	
	finallyRenderLighbox();
	isLightBoxOn = true;
}

function finallyRenderLighbox()
{
	$('#eventDescriptionWrapper').css("height",window.innerHeight*0.7);//Equal to Height of LightBox
	//$('#eventDescriptionWrapper').css("width",window.innerWidth*0.7);//Equal to Height of LightBox
	$("#lightBoxContent").css("width",window.innerWidth);
	$("#lightBoxContent").css("left",$('#events').scrollLeft());
}

function renderInfo()
{
	
	var i;
	$('.tab').remove();
	for(i in currEventInfo)
	{
		subId = i.replace(" ","_");
		if(subId == 'overview')
			$("#iconList").prepend("<div class='tab' id='tab"+subId+"'></div>");
		else
			$("#iconList").append("<div class='tab' id='tab"+subId+"'></div>");
		$("#tab"+subId).css("background-image","url(./images/icons/"+subId+"-black.png)");
	}
	$("#Icon_register").css("background-image","url(./images/icons/register-black.png)");
	$("#Icon_register").css("display","block");	
	addFuncTab();
	
	var i;
	for(i in currEventInfo)
	{	
		if(i == "overview")
		{	
			document.getElementById("infoHeader").innerHTML = "Overview";
			document.getElementById("info").innerHTML = currEventInfo[i]["Overview"];
			$("#info").append("<br>");
			$("#info").append(currEventInfo[i]["Contact"]);
			break;
		}
	}
	ajaxDone = true;
	openLightBox();
}

function openLightBox()
{
	if(highResLoaded && ajaxDone)
	{
		highResLoaded =	false;
		ajaxDone = false;
		$('#eventsLoader').fadeOut(300,function(){
		
		
			if(isSearchOn)
			{
				$('#search').animate({right:"-290px"},220);
				isSearchOn = false;
				setTimeout(function(){
					$("#lightBox").animate({height:"70%"},500);
					$('#events').animate({scrollTop:(eventRow-1)*window.innerHeight*0.2 + 10}, '500');},220);
				setTimeout(function(){$(".nano").nanoScroller();},725);
				wasSearchClosedByLB = true;
			}
			else
			{
				$("#lightBox").animate({height:"70%"},500);
				$('#events').animate({scrollTop:(eventRow-1)*window.innerHeight*0.2 + 10}, '500');
				setTimeout(function(){$(".nano").nanoScroller();},505);
			}
		});
	}
	$(".nano").nanoScroller();
}




function addFuncTab()
{
	$('.tab').click(function(){
	
		var tabID = $(this).attr("id");
		var objectID = tabID.substring(3);
		var newObjectID = objectID.replace("_"," ");

		var i;
		for(i in currEventInfo)
		{
			if(i == newObjectID)
			{	
				if(newObjectID == "overview")
				{
					document.getElementById("infoHeader").innerHTML = "Overview";
					document.getElementById("info").innerHTML = currEventInfo[i]["Overview"];
					$("#info").append("<br>");
					if(currEventInfo[i]["Contact"] != undefined)
						$("#info").append(currEventInfo[i]["Contact"]);
					$(".nano").nanoScroller();
				}
				else
				{
					document.getElementById("infoHeader").innerHTML = newObjectID;
					document.getElementById("info").innerHTML = currEventInfo[i];
					$(".nano").nanoScroller();
				}
				break;
			}
		}
	});
	
	$(".tab").mouseover(function(){
		imgId = $(this).attr("id").substring(3);
		$(this).css("background-image","url('./images/icons/"+imgId+"-white.png')");
	});
	
	$(".tab").mouseout(function(){
		imgId = $(this).attr("id").substring(3);
		$(this).css("background-image","url('./images/icons/"+imgId+"-black.png')");
	});
	
	$("#Icon_register").mouseover(function(){
		$("#Icon_register").css("background-image","url('./images/icons/register-white.png')");
	});
	
	$("#Icon_register").mouseout(function(){
		$("#Icon_register").css("background-image","url('./images/icons/register-black.png')");
	});
}


function addLightboxFunc ()
{
	$(".eventInfoIcon").click(function(event){
		var id = event.target.id.substring(5);
		document.getElementById("info").innerHTML = "";
		document.getElementById("infoHeader").innerHTML = "";
		$(".nano").nanoScroller();
		switch (id)
		{
	
			case 'register':
							if(currEventInfo["overview"]["IsTeam"] == true)
							{
								handleTeam();
							}
							else
							{
								$.ajax({
									url: 'http://bits-apogee.org/2015/registration/joinevent/',
									type: 'POST',
									dataType: 'json',
									cache:false,
									data: {id:currEvent},
								})
								.success(function(e) {
									document.getElementById("infoHeader").innerHTML = "";
									document.getElementById("info").innerHTML = "";
									$("#infoHeader").append("Register");$("#info").append(e.message);
								});
							}
							break;
		}
	});
}

function handleTeam()
{
	document.getElementById("infoHeader").innerHTML = "Register";
	document.getElementById("info").innerHTML = "This is a team event. You either need to create a new team or join an already Existing one...<br>";
	
	$("#info").append("<br><div onclick='createTeam()' class='teamChoice'>Create Team</div><br>");
	$("#info").append("<div onclick='joinTeam()' class='teamChoice'>Join Team</div>");
}

function createTeam()
{
	document.getElementById("infoHeader").innerHTML = "Create Team";
	document.getElementById("info").innerHTML = "Creating Team....";
	//alert(currEvent);
	$.ajax({url: 'http://bits-apogee.org/2015/registration/createteam/',
			type: 'POST',
			dataType: 'json',
			cache:false,
			data: {id:currEvent}													,
			})
			.success(function(e) {
			
			document.getElementById("info").innerHTML = e.message;
			//$("#info").append(e.message);
			//console.log(e);
			//console.log(e.message);
			//alert(e.message);
			});													
}
function joinTeam()
{
		document.getElementById("infoHeader").innerHTML = "Join Team";
		document.getElementById("info").innerHTML = "Please enter the unique team code which you got while creating the team...";
		$("#info").append("<br><br><input id='teamcode' placeholder='Team Code'><br><br>");
		$("#info").append("<div onclick='validateCode()' class='teamChoice'>Join</div>");
}

function validateCode()
{
	//alert(document.getElementById('teamcode').value);
	code = document.getElementById('teamcode').value;
	$.ajax({url: 'http://bits-apogee.org/2015/registration/jointeam/',
			type: 'POST',
			dataType: 'json',
			cache:false,
			data: {id:currEvent,team_code:code}												,
			})
			.success(function(e) {
			
			document.getElementById("info").innerHTML = e.message;
			//$("#info").append(e.message);
			//console.log(e);
			//console.log(e.message);
			//alert(e.message);
			});	
}

function closeLightBox()
{
	if(wasSearchClosedByLB)
	{
		$("#lightBox").animate({height:"0"},250);
		setTimeout(function(){isLightBoxOn = false;$('#search').animate({right:"0px"},300);},250);
		isSearchOn = true;
	}
	else
	{
		$("#lightBox").animate({height:"0"},250);
		setTimeout(function(){isLightBoxOn = false;},250);
	}
	currEvent = "";
}


//=========================================================SEARCH STARTS================================================

function setUpSearchRandom()
{
	
	$('#search').mouseenter(function(){
		isInsideSearchDiv = true;
	});
	$('#search').mouseleave(function(){
		isInsideSearchDiv = false;
	});
	
	$('#searchIcon').click(function(){
		if(isLightBoxOn)
		{
			closeLightBox();
			setTimeout(function(){$('#search').animate({right:"0px"},300);},250)
		}
		else
		{
			if(currentLargestContainer != "EVENTS")
			{
				$(".largestContainer").fadeOut(300,function(){$("#eventsWrapper").fadeIn(300,function(){$('#search').css("right","0px");})});
				
			}
			else
			{
				$('#search').css("right","0px");
			}
			
		}
		currentLargestContainer = "EVENTS";
		document.getElementById("searchField").focus();
		isSearchOn = true;
	});
	
	$('#iconBack').click(function(){
		closeSearch();
	});
	
	
	$("#searchField").keyup(function() {
		var ip = document.getElementById("searchField").value;
		if(ip!='')
		{	requiredEventList = searchRandomObject.search(ip);
			document.getElementById("searchResults").innerHTML = "";
			var count = 0;
			while(count !=4 && count<requiredEventList.length)
			{
				$("#searchResults").append("<div class='searchResult' id='result"+requiredEventList[count]["sno"]+"'>"+requiredEventList[count]["name"]+"</div>");
				$("#result"+requiredEventList[count]["sno"]).click(function(event){
						var divID = "event" + event.target.id.substring(6);
						showLightBox(divID);
				});
				//console.log(requiredEventList[count]["sno"]);
				count++;
			}
		}
		else
		{	requiredEventList = events;
			document.getElementById("searchResults").innerHTML = "";
		}
		showReqEvents();
	});
	
	addListenFilters();
	addKernelFilter();
}
function closeSearch()
{
	$('#search').animate({right:"-290px"},220);
		requiredEventList = events;
		showReqEvents();
		isSearchOn = false;
		wasSearchClosedByLB = false;
}
function addListenFilters()
{
	$(".filter").click(function(event){
		if((event.target.innerHTML+"") == "DEVELOP &amp; DISCOVER")
		{	requiredEventList = searchCategoryObject.search("Develop & Discover");
		}
		else if((event.target.innerHTML+"") == "CODE &amp; SIMULATE")
		{	requiredEventList = searchCategoryObject.search("Code & Simulate");}
		else
		{	requiredEventList = searchCategoryObject.search(event.target.innerHTML);}
		$('#events').animate({scrollLeft:0}, '500');
		showReqEvents();
	});
}
function addKernelFilter()
{
	$(".kernelfil").click(function(){
		var i;
		var count = 0;
		var kernel = [];
		for(i = 0; i<events.length; i++)
		{
			if(events[i]["kernel"])
			{	
				kernel.push(events[i]);
			}
		}
		requiredEventList = kernel;
		$('#events').animate({scrollLeft:0}, '500');
		showReqEvents();
	});
}
//=======================================================MOTION OF DIV ON MOUSE MOVE============================================
var $elems = $("html, body");
var deltaY = 0;
var deltaX = 0;

$(document).on("mousemove", function(e) {
    var h = window.innerHeight;
	var w = window.innerWidth;
    var y = e.clientY - h / 2;
    var x = e.clientX - w / 2;
    deltaY = y * 0.02;
    deltaX = x * 0.015;
});

$(window).on("blur mouseleave", function() {
	deltaY = 0;
	deltaX = 0;
});

(function f() {
	if(deltaY && !isLightBoxOn && !isInsideSearchDiv) {
        $("#events").scrollTop(function(i, v) {
            return v + deltaY;
        });
    }
	if(deltaX && !isLightBoxOn && !isInsideSearchDiv) {
        $("#events").scrollLeft(function(i, v) {
            return v + deltaX;
        });
    }
	window.requestAnimationFrame(f);
})();




/* ===========================WORKSHOPS=========================================================== */
var currWorkshop = 0;
var descriptions = [
{	name:"Robotics",
	//desc:"6th Sense Robotics will focus on getting you up and running with Arduino quickly, so that you will understand the basic procedures for working with Arduino and can explore further on your own. An Arduino is a small computer that you can program to control things like lights or motors along with listening to components like motion detection sensors. It can give your project interactivity without needing an expensive and large circuit. Instead, you use a computer to program the Arduino, upload your code to the Arduino, and hook up your circuit..",
	desc:"AVR Embedded Systems Workshop mainly focuses on the students eager to learn about Advance features of AVR Microcontroller. They will get a chance to expand their knowledge in interfacing external advance peripherals like Matrix Keypad, LCD Display, Seven Segment Display and their application in real time projects.The duration of this workshop will be two consecutive days with eight hours session each day, in a total of sixteen hours properly divided into theory and hand on practical sessions",
	date:"Date : 26-27th March",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjMyNw==&wt=OA=="
},

{	name:"Automobile Engine",
	desc:"Automobile and IC Engine Mechanics Workshop mainly focuses from Basics to Advanced concepts in Automobile Engineering. It covers chassis design, working of Suspension unit, Steering System, Braking unit, Transmission, Fuel Supply System, IC Engine and Advanced Technologies like ABS, EBD, PGMFi, DTS-Fi, MPFI, VVTI. At the end of this workshop, a competition will be organized among the participating students where each participating student will get Certificate of Participation and the Winners will get Certificate of Merit..",
	date:"Date : 27th-28th March",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjMyOA==&wt=MjY="
},
{	name:"Quadcopter",
	desc:"Quadcopter is a multi rotor air vehicle which has marked its interests for the benefit of both civil and military domains. It's amazing maneuverability and the ease to fly in constricted locations has achieved itself a remarkable position in the aviation sector. Our workshop helps participants understand the concepts and use of accelerometer sensor, microcontrollers, and wireless communication in designing and controlling a Quadcopter...",
	date:"Date : 26th-27th March",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjMzMw==&wt=MjM="
},
{	name:"Web Development",
	desc:"Web Designing is the planning and creation of websites. This includes the information architecture, user interface, site structure, navigation, layout, colors, fonts, and imagery. All of these are combined with the principles of design to create a website that meets the goals of the owner and designer. The duration of Web Designing workshop will be two consecutive days, with eight hours session each day in a total of sixteen hours, properly divided into theory and hand on practical sessions.",
	date:"Date : 26th-27th March",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjMzMA==&wt=Ng=="
},
{	name:"Cloud Computing",
	desc:"Cloud computing is a type of computing that relies on sharing computing resources rather than having local servers or personal devices to handle applications.Cloud computing has recently emerged as one of the buzzwords in the IT industry. Numerous IT vendors are promising to offer computation, storage, and application hosting services and to provide coverage in several continents, offering service level agreements (SLA) backed performance and uptime promises for their services.",
	date:"Date : 27th-28th March",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjMyOQ==&wt=NjI="
},
{	name:"Animation",
	desc:"Animation is the process of creating motion and shape change illusion by means of the rapid display of a sequence of static images that minimally differ from each other. The illusion—as in motion pictures in general—is thought to rely on the phi phenomenon.If you have a knack of design and interested in animation, come learn as much as you can in this two day workshop.",
	date:"Date : 28th-29th March",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjM4Ng==&wt=ODA="
},
{	name:"Ethical Hacking",
	desc:"To beat a hacker, you need to think like one! This is exactly what this class will teach you. It is the pinnacle of the most desired information security training program any information security professional will ever want to be in. The Certified Ethical Hacker class will immerse the students into a hands-on environment where they will be shown how to conduct ethical hacking. They will be exposed to an entirely different way of achieving optimal information security posture in their organization; by hacking it! They will scan, test, hack and secure their own systems. Click <a href='./pdf_files/Ethical_Hacking.pdf' target='_blank'>here</a> for more details.",
	date:"Date : 27th-28th March",
	url:"http://goo.gl/forms/IR7AczCFBJ"
},
{	name:"Financial Markets",
	desc:"Participants would be taught the basics of financial markets from a practical perspective by financial markets professionals from the Indian hedge fund industry. A very useful course for freshers and graduates looking to kick-start into the domain of trading and investment. Course content is relevant to the Indian capital markets (stocks, commodities, currencies, rates). Participants would be given a balanced exposure of theoretical and practical aspects involved in trading. Bright candidates would receive a job/internship opportunity as an algorithmic trader at HQ Capital Advisory, LLP, Kolkata. Click <a href='./pdf_files/Finance_Workshop.pdf' target='_blank'>here</a> for more details.",
	date:"Date : 28th-29th March",
	url:"http://goo.gl/forms/9VT9UBlQrw"
}
/* {	name:"STAAD PRO",
	desc:"STAAD Pro is a structural analysis and design software which is used to model and design the structures virtually. It has been developed by Bentley's Systems. This course covers the essential tools and commands of STAAD Pro. Students are introduced to the concepts of structure modelling, analysis, design and documentation. This course offers hands-on exercises representing real-world structural design scenarios. This course is designed for freshers and experienced and covers the basics of STAAD Pro, from structural design through construction documentation. No previous CAD experience is necessary.",
	date:"Date : ",
	url:"http://www.robosapi.com/staad-pro"
},
{	name:"Matlab",
	desc:"Matlab workshop mainly focuses on the student eager to learn about Matrix Laboratory which is a high-level language and interactive environment for numerical computation, visualization, and programming. Using MATLAB, a student can analyze data, develop algorithms, and create models and applications. The language, tools and built-in math functions provide to explore multiple approaches and reaches to solution faster than with spreadsheets or traditional programming languages. MATLAB can be used for a range of applications including signal processing and communications, image and video processing, control systems, test and measurement, computational finance, and computational biology.",
	date:"Date : ",
	url:"http://www.robosapi.com/index.php/workshop_registration/workshop_registration/learn_more?w=MjMzMg==&wt=MzM="
} */
];

contact_details = '<br>Contact : <br>Sudarshan Vijay<br>+91-8504003004&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudarshanvj@gmail.com';

function workshop()
{
	initializeWorkshops();
	setArrowsActive();
	loadWorkshopImages();
}
function initializeWorkshops()
{
	$('#workshopWrapper').css("background-image",'url(./images/workshops/'+descriptions[0]["name"]+'.jpg)');
	document.getElementById('workshopName').innerHTML = descriptions[0]["name"];
	document.getElementById('workshopDesc').innerHTML = descriptions[0]["desc"];
	document.getElementById('workshopDesc').innerHTML += "<br>" + descriptions[0]["date"];
	document.getElementById('workshopDesc').innerHTML += contact_details;
	
	$("#readMore").attr('href',descriptions[0]["url"]);
	
	var i =0;
	for(i=0; i<descriptions.length; i++)
	{
		$(".shortcutButtons").append("<div class='shrtButton' onclick='useshrt("+i+")'>"+descriptions[i]["name"]+"</div>")
	}
	$(".shortcutButtons").css("width",descriptions.length*165);
	//$(".shortcutButtons :nth-child(1)").css("background-color","rgb(255,255,255)");
	//$(".shortcutButtons :nth-child(1)").css("color","rgb(20,20,20)");
	$(".shortcutButtons :nth-child(1)").toggleClass('activeWorkshop');
}

function loadWorkshopImages()
{
	var i =0;
	var count = 0;
	for(i=0; i<events.length; i++)
	{
			var theImage = new Image();
			$(theImage).load(function() {
				// The image has loaded (from cache, or just now)
				// ...do something with the fact the image loaded...
				count++;
				if(count == descriptions.length)
				{
					areWorkshopImagesLoaded = true;
					//console.log("Workshop Images Loaded....Time to remove Loader");
					removeMainLoader();
				}
			});
			var imgName = descriptions[i].name.replace(" ","_");
			theImage.src = "./images/workshops/"+imgName+".jpg";
			//console.log(events[i]["name"]+" Loaded"+ i);
	}
}
function setArrowsActive()
{
	$('#nextArrow').click(function(){
		if(currWorkshop == (descriptions.length - 1))
		{
			runAnimation(0);
		}
		else
			runAnimation(currWorkshop + 1);
	});
	$('#prevArrow').click(function(){
		if(currWorkshop == 0)
		{
			runAnimation((descriptions.length - 1));
		}
		else
			runAnimation(currWorkshop - 1);
	});
}
function runAnimation(x)
{
	if(x == currWorkshop) { return;}
	$("#contentWorkshop").animate({top:"50px"},500);
	$('#workshopWrapper').animate({opacity:0,top:"50px"},500,function(){
		var imgName = descriptions[x]["name"].replace(" ","_");
		$('#workshopWrapper').css("background-image",'url(./images/workshops/'+imgName+'.jpg)');
		document.getElementById('workshopName').innerHTML = descriptions[x]["name"];
		document.getElementById('workshopDesc').innerHTML = descriptions[x]["desc"];
		document.getElementById('workshopDesc').innerHTML += "<br>" + descriptions[x]["date"];
		document.getElementById('workshopDesc').innerHTML += contact_details;
		$("#readMore").attr('href',descriptions[x]["url"]);
		$('#workshopWrapper').animate({opacity:1,top:"0px"},500);
		$("#contentWorkshop").animate({top:"0px"},800);
		
	});
	currWorkshop = x;
	
	$(".activeWorkshop").toggleClass('activeWorkshop');
	$(".shortcutButtons :nth-child("+(x+1)+")").toggleClass('activeWorkshop');
	
	//$(".shortcutButtons div").css("background-color","rgba(255,255,255,0)");
	//$(".shortcutButtons :nth-child("+(x+1)+")").css("background-color","rgb(255,255,255)");
	//$(".shortcutButtons :nth-child("+(x+1)+")").css("color","rgb(20,20,20)");
}

function useshrt(x)
{
	runAnimation(x);
}


/* ===================PAPERS and PROJ================== */
function paperProj()
{
	$('#papersInnerList li').click(function(){
		
		if(!($(this).hasClass("activeInnerListPaper")))
		{
			var id = $(this).attr("id");
			var contentid = id.substring(2);
			$('.paperInnerContent').fadeOut(200);
			setTimeout(function(){$('#'+contentid).fadeIn(200,function(){$(".nano").nanoScroller();});},400);
			$(".activeInnerListPaper").toggleClass('activeInnerListPaper');
			$(this).toggleClass('activeInnerListPaper');
		}
	});
	
	$('#projInnerList li').click(function(){
		
		if(!($(this).hasClass("activeInnerListProj")))
		{
			var id = $(this).attr("id");
			var contentid = id.substring(2);
			$('.projInnerContent').fadeOut(200);
			setTimeout(function(){$('#'+contentid).fadeIn(200,function(){$(".nano").nanoScroller();});},400);
			$(".activeInnerListProj").toggleClass('activeInnerListProj');
			$(this).toggleClass('activeInnerListProj');
		}
	});
}
