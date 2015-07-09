var profileFile = fs.open('userdata/profiles.json', 'a+');

function addNewForm() {
	var numericId = 1;
	if($("[id^=profile-name-input]").length!=0) {
		numericId = parseInt($("[id^=profile-name-input]").last().attr("id").split("-")[3])+1;
	}
	
	var newForm = '';
	newForm += '<div id="tmp-container-'+numericId+'" style="display:none">';
	newForm += '<input id="profile-name-input-'+numericId+'" class="profile-name-input" placeholder="Profile Name"><br>';
	newForm += '<div class="input-folder">';
	newForm += '<span class="mega-octicon octicon-file-directory"></span>';
	newForm += '	<input id="source-input-'+numericId+'" readonly placeholder="Source Folder">';
	newForm += '</div><br>';
	newForm += '<div class="input-folder">';
	newForm += '<span class="mega-octicon octicon-file-directory"></span>';
	newForm += '	<input id="destination-input-'+numericId+'" readonly placeholder="Destination Folder">';
	newForm += '</div><br>';
	newForm += '<div class="remove-form"><span class="octicon octicon-dash"></span></div>';
	newForm += '<div style="margin-top:20px;width:100%;border-top:1px gray solid" id="form-separator-'+numericId+'"></div>';
	newForm += '</div>';
	if(numericId==1) {
		newForm += '<button class="input-button">Save</button>';
		$("#add-profile-form").append(newForm);
	}
	else {
		$("#tmp-container-"+(numericId-1)).after(newForm);		
	}
	// $("#form-separator-1").after(newForm).fadeIn();
	$("#tmp-container-"+numericId).fadeIn(1000);
}

function removeForm() {
	var availableForms = $("[id^=profile-name-input]");
	var numericId = availableForms.length;
	if(numericId == 1) {
		$(".input-button").fadeOut(500,function() {
			$(".input-button").remove();
		});		
	}
	var context = this;
	$(this).parent().fadeOut(500,function() {
		$(context).parent().remove();
	});
}

function fillFolderInputs() {
	$('#folder-input-common').off('change');
	$("#folder-input-common").trigger("click");
	var context = this;
	$("#folder-input-common").on("change",function() {
		$(context).children("input").val($("#folder-input-common").val());			
	});
}

function validations() {
	var error = false;
	$(".profile-name-input").each(function () {
		if($(this).val()=="")
			error = true;
	});
	

	$(".input-folder input").each(function () {
		if($(this).val()=="")
			error = true;
	});

	if(error) {
		alert("One or more fields are empty!");
		return
	}
}

function submitAddProfileForm(e) {
  	e.preventDefault();
  	validations();
  	console.log(fs);
}

$(".profile-add-btn").click(addNewForm);
$("div").on("click",".remove-form",removeForm);
$("body").on("click",".input-folder",fillFolderInputs);
$( "#add-profile-form" ).submit(submitAddProfileForm);