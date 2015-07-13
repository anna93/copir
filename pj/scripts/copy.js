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
		$(context).val($("#file-input-common").val());			
	});
}

$("#profile-selector").mouseenter(updateDropDown);
$("#input-file-txt").click(fillFileInputs);