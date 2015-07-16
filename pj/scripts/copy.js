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

function populateLeftHelper(content) {
	$("#selector-left, #selector-right").html();
	var rows = '';
	rows += '<div><input id="select-all-left" type="checkbox">&nbsp;<label style="direction:ltr">Select all</label><div class="clearfix"></div></div>';

	$(content).each(function() {
		rows += '<div title="'+this+'"><input class="cbk-left" type="checkbox">&nbsp;<label>'+this+'</label><div class="clearfix"></div></div>';		
	});

	$("#selector-left").html(rows);
}


function selectAllLeft() {
	if($(this).is(":checked")) {
		$(this).parent().css("background-color","#333");
		$("#selector-left .cbk-left").each(function() {
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
			$(this).parent().remove();
			rows += '<div title="'+text+'"><input class="cbk-right" type="checkbox">&nbsp;<label>'+text+'</label><div class="clearfix"></div></div>';		
		});
		$("#selector-right").append(rows);
		
		if($("#selector-left input").length == 1) {
			$("#selector-left").html('');
		}
	}
}

function moveLeft() {
	if($(".cbk-right:checked").length > 0) {
		var rows = '';
		if($("#selector-left input").length == 0) {
			rows += '<div><input id="select-all-left" type="checkbox">&nbsp;<label style="direction:ltr">Select all</label><div class="clearfix"></div></div>';
		}

		$(".cbk-right:checked").each(function() {
			var text = $(this).next().html();
			$(this).parent().remove();
			rows += '<div title="'+text+'"><input class="cbk-left" type="checkbox">&nbsp;<label>'+text+'</label><div class="clearfix"></div></div>';		
		});
		$("#selector-left").append(rows);
		
		if($("#selector-right input").length == 1) {
			$("#selector-right").html('');
		}
	}
}

$("#profile-selector").mouseenter(updateDropDown);
$("#input-file-txt").click(fillFileInputs);
$("#move-right").click(moveRight);
$("#move-left").click(moveLeft);
$('body').on('change','#select-all-left',selectAllLeft);
$('body').on('change','#select-all-right',selectAllRight);
$('body').on('change','.cbk-right',changeBackgroundColorCbkRight);
$('body').on('change','.cbk-left',changeBackgroundColorCbkLeft);
