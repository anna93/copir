var fse = require('fs-extra');
var inputFileVal = '';

function updateDropDown() {
	var saveVal = false;
	if($("#profile-selector option:selected").length == 1) {
		saveVal = $("#profile-selector option:selected").html();
	}

	$(".volatile").remove();
	
	var newOptions = ''; 
	$(profileData).each(function() {
		newOptions += '<option class="volatile" data-source="'+this.source+'" data-destination="'+this.destination+'">'+this.name+'</option>';
	});
	$(this).append(newOptions);

	if(saveVal != false) {
		$("#profile-selector option:contains("+saveVal+")").attr("selected","selected")
	}
}

function fillFileInputs() {
	$('#file-input-common').off('change');
	$("#file-input-common").trigger("click");
	var context = this;
	$("#file-input-common").on("change",function() {
		inputFileVal = $("#file-input-common").val();
		$(context).val(inputFileVal);	
		populateLeft();	
	});
}

function populateLeft() {
	var content = '';
	fs.readFile(inputFileVal,'utf8',function(err,data) {
		if (err) {
			throw err;
			alert("Could not open file, try again.");
		}
	    if(data != "") {
		    content = data;		    
		    content = content.split("\n");
		    populateLeftHelper(content);
		    // console.log(content);
		}
	});
}

function populateLeftUsingPaste(e) {
	e.preventDefault();
	var content = '';
	content = e.originalEvent.clipboardData.getData('text');
	content = content.replace(/\//g, '\\');
	content = content.split("\n");
	populateLeftHelper(content);
}

function populateLeftHelper(content) {
	$("#selector-left, #selector-right").html();
	var rows = '';
	rows += '<input id="file-filter" placeholder="filter" title="use | to filter multiple file names"><br/><div class="clearfix"></div>';
	rows += '<div><input id="select-all-left" type="checkbox">&nbsp;<label style="direction:ltr">Select all</label><div class="clearfix"></div></div>';
	var isInputFromUpdateCommand = false;
	var projectURLFromInput = '';
	$(content).each(function() {
		var line = this.split(' ');

		if(line[0].length <= 1) {
			return;
		}

		if(line[0] === "Command:" || line[0] === "Updating:" || line[0] === "Completed:") {
			isInputFromUpdateCommand = true;
			if(line[0] === "Updating:")	{
				projectURLFromInput = line[1] ;
			}
			return;
		}

		var displayPath = this;
		if(isInputFromUpdateCommand) {
			displayPath = line[1].replace(projectURLFromInput,'');
		}else {
			displayPath = displayPath.split('\\');
			displayPath.splice(1, 1);
			displayPath = displayPath.join('\\');
		}

		var displayPathWithoutLeadingSlash;
		displayPathWithoutLeadingSlash = displayPath[0]=="\\"?displayPath.replace("\\",''):displayPath;
		rows += '<div title="'+displayPath+'"><input class="cbk-left" type="checkbox">&nbsp;<label>'+displayPathWithoutLeadingSlash+'</label><div class="clearfix"></div></div>';		
	});

	$("#selector-left").html(rows);
	$('#selector-left').prop("contenteditable",false);
}


function fnFilterFiles() {
	var regexp = new RegExp($('#file-filter').val(), 'gi');
	var visible = [];
	$('.cbk-left').each(function() {
		var filePath = $(this).next().html();
		if(!filePath.match(regexp)) {
			$(this).parent().css('display','none');
		}
		else {
			$(this).parent().css('display','block');
		}
	});

	if($('.cbk-left').parent().filter(function () { 
    	return this.style.display == 'block' 
	}).length == 0) {
		$('#select-all-left').parent().css('display','none');
	}
	else {
		$('#select-all-left').parent().css('display','block');
	}
}

function selectAllLeft() {
	if($(this).is(":checked")) {
		$(this).parent().css("background-color","#333");
		$("#selector-left .cbk-left").each(function() {
			if($(this).parent().css('display')=='none') { //ignoring the ones which were filtered out
				return; 
			}
			$(this).prop("checked",true);
			$(this).parent().css("background-color","#333");
		});
	}
	else {		
		$(this).parent().css("background-color","#101010");
		$("#selector-left .cbk-left").each(function() {			
			$(this).prop("checked",false);
			$(this).parent().css("background-color","#101010");
		});
	}
}


function selectAllRight() {
	if($(this).is(":checked")) {
		$(this).parent().css("background-color","#333");
		$("#selector-right .cbk-right").each(function() {
			$(this).prop("checked",true);
			$(this).parent().css("background-color","#333");
		});
	}
	else {
		$(this).parent().css("background-color","#101010");
		$("#selector-right .cbk-right").each(function() {
			$(this).prop("checked",false);
			$(this).parent().css("background-color","#101010");
		});
	}	
}


function changeBackgroundColorCbkLeft() {
	if($(this).is(":checked")) {
		$(this).parent().css("background-color","#333");
	}
	else {
		$(this).parent().css("background-color","#101010");
		$("#select-all-left").prop("checked",false);
		$("#select-all-left").parent().css("background-color","#101010");
	}
}

function changeBackgroundColorCbkRight() {
	if($(this).is(":checked")) {
		$(this).parent().css("background-color","#333");
	}
	else {
		$(this).parent().css("background-color","#101010");
		$("#select-all-right").prop("checked",false);
		$("#select-all-right").parent().css("background-color","#101010");
	}
}


function moveRight() {
	if($(".cbk-left:checked").length > 0) {
		var rows = '';
		if($("#selector-right input").length == 0) {
			rows += '<div><input id="select-all-right" type="checkbox">&nbsp;<label style="direction:ltr">Select all</label><div class="clearfix"></div></div>';
		}

		$(".cbk-left:checked").each(function() {			
			var text = $(this).next().html();
			var title = $(this).parent().prop('title');
			$(this).parent().remove();
			rows += '<div class="files-tobe-copied" title="'+title+'"><input class="cbk-right" type="checkbox">&nbsp;<label>'+text+'</label><div class="clearfix"></div></div>';		
		});
		$("#selector-right").append(rows);
		
		if($("#selector-left input").length == 2) {
			$("#selector-left").html('');
			$("#selector-left").html('<input id="file-filter" placeholder="filter" title="use | to filter multiple file names"><br/><div class="clearfix"></div>');
		}
	}
	$('#select-all-left').trigger('click');
}

function moveLeft() {
	if($(".cbk-right:checked").length > 0) {
		var rows = '';
		if($("#selector-left input").length == 1) {
			rows += '<div><input id="select-all-left" type="checkbox">&nbsp;<label style="direction:ltr">Select all</label><div class="clearfix"></div></div>';
		}

		$(".cbk-right:checked").each(function() {
			var text = $(this).next().html();
			var title = $(this).parent().prop('title');
			$(this).parent().remove();
			rows += '<div title="'+title+'"><input class="cbk-left" type="checkbox">&nbsp;<label>'+text+'</label><div class="clearfix"></div></div>';		
		});
		$("#selector-left").append(rows);
		
		if($("#selector-right input").length == 1) {
			$("#selector-right").html('');
		}
	}
}

function startFileCopy() {
	if($("#profile-selector option[class=volatile]:selected").length == 0) {
		alert('You must select a profile');
		return false;
	}

	var errorWhileCopying = false;
	var source = $("#profile-selector option[class=volatile]:selected").attr("data-source");
	var destination = $("#profile-selector option[class=volatile]:selected").attr("data-destination");

	if($('.files-tobe-copied').length == 0) {
		alert("Please move file list from left to right before copy");
		return;
	}

	if(confirm('Are you sure, you want files listed in the right to be copied\n from:'+source+'\n to:'+destination)) {
		$(".files-tobe-copied").each(function () {
			var fileDirectory = $(this).prop('title');
			try {
				fse.copySync((source+fileDirectory).replace(/(\r\n|\n|\r)/gm,""), 
				(destination+fileDirectory).replace(/(\r\n|\n|\r)/gm,""), 
				{ replace: true }, 
				function (err) {
				  if (err) {
				  	alert(err);
				    console.error(err);
				  }			  
				});
			}
			catch(err) {
				alert("Error in copying "+source+fileDirectory);
				errorWhileCopying = true;	
			}
		});

		if(errorWhileCopying) {
			alert("There were some errors while copying files");			
		}
		else {
			alert("All files copied successully");
		}

		$("#selector-right").html('');
	}
}

$("#profile-selector").mouseenter(updateDropDown);
$('#selector-left').on('paste', populateLeftUsingPaste);
$("#input-file-txt").click(fillFileInputs);
$("#move-right").click(moveRight);
$("#move-left").click(moveLeft);
$('body').on('change','#select-all-left',selectAllLeft);
$('body').on('change','#select-all-right',selectAllRight);
$('body').on('change','.cbk-right',changeBackgroundColorCbkRight);
$('body').on('change','.cbk-left',changeBackgroundColorCbkLeft);
$('#copy-btn').on('click',startFileCopy);
$('body').on('keyup','#file-filter',fnFilterFiles);