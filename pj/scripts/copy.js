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


$('body').on('change','#select-all-left',function() {
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
})

$('body').on('change','.cbk-left',function() {
	if($(this).is(":checked")) {
		$(this).parent().css("background-color","#333");
	}
	else {
		$(this).parent().css("background-color","#101010");
		$("#select-all-left").prop("checked",false);
		$("#select-all-left").parent().css("background-color","#101010");
	}
});


$("#profile-selector").mouseenter(updateDropDown);
$("#input-file-txt").click(fillFileInputs);