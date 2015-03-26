function next()
{
	$('#globeText').fadeOut(300,function(){$('#tutorialImg,#searchTut').fadeIn(300)});
	$('#next').fadeOut(0);
	document.getElementById('skip').innerHTML = 'Finish';
	$("#skip").css("float","none");
	$("#skip").css("margin","auto");
}

function skip()
{
	$('#tutorial').fadeOut(300);
}