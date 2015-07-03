var fs = require('fs');

$("#btnSource").on("click",function() {
	$("#source").trigger("click");
	$("#source").change(function() {
		$("#valSource").html(($(this).val()));
	});
});

$("#btnDestination").on("click",function() {
	$("#destination").trigger("click");
	$("#destination").change(function() {
		$("#valDestination").html(($(this).val()));
	});
});

$("#input").change(function() {
	var filePath = $(this).val();
	$("#valInput").html(filePath);
	fs.readFile(filePath,'utf8', function (error, contents) {
		$("#inputContent").html(contents);
		contents = contents.split("\n");
		alert(contents.length);
		fs.createReadStream('C:\\Users\\SHEKHAR\\Desktop\\images\\source\\sample.txt').pipe(fs.createWriteStream('C:\\Users\\SHEKHAR\\Desktop\\images\\destination\\sample.txt'));
	});
});