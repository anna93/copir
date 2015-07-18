var fs = require('fs');
var gui = require('nw.gui');
var win = gui.Window.get();

$("#minimize").click(function() {
	win.minimize();
});

$("#close").click(function() {
	win.close();
});

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

$('.nav-item').click(function() {
	var id = $(this).attr('aria-controls');
	$('a[aria-controls="'+id+'"]').tab('show');
});

$("#input").change(function() {
	var filePath = $(this).val();
	$("#valInput").html(filePath);
	fs.readFile(filePath,'utf8', function (error, contents) {
		$("#inputContent").html(contents);
		contents = contents.split("\n");
		alert(contents.length);
		// fs.createReadStream('C:\\Users\\SHEKHAR\\Desktop\\images\\source\\sample.txt').pipe(fs.createWriteStream('C:\\Users\\SHEKHAR\\Desktop\\images\\destination\\sample.txt'));

		fse.copy('C:\\Users\\SHEKHAR\\Desktop\\images\\source\\sample.txt', 
			'C:\\Users\\SHEKHAR\\Desktop\\images\\destination\\sample.txt', 
			{ replace: true }, 
			function (err) {
			  if (err) {
			    // i.e. file already exists or can't write to directory 
			    console.error(err);
			    throw err;
			  }
			 
			  console.log("Copied 'sample.txt' to 'sample.txt'");
			});	
	});
});