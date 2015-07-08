$(".profile-add-btn").click(function() {
	var availableForms = $("[id^=profile-name-input]");
	var numericId = availableForms.length+1;
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
});