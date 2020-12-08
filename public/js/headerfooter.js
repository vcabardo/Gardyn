
//used for reusable headers/footers, finds id of each in html and replaces with reusableheader/footer html
$(document).ready(function () {
  $('#header').load('reusableheader.html');
});

$(document).ready(function () {
  $('#footer').load('reusablefooter.html');
});