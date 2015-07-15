// var profileFile = fs.open('userdata/profiles.json', 'a+');
var profileData = [];
var cardCounter = 1;

$('a[aria-controls="copy"]').tab('show');

fs.readFile('userdata/profiles.json','utf8',function(err,data) {
	if (err) {
		throw err;
		alert("Could not open user profile, exiting.");
		win.close();
	}
    if(data != "") {
	    try{
	        profileData=$.parseJSON(data);
	        if(profileData.hasOwnProperty("profiles")) {
	        	profileData = profileData["profiles"];
	        	generateProfileCardsOnLoad();
	        }
	    }catch(e){
	        alert("Corrupted user profile, exiting");
	        win.close();
	    }    
	}
});

function generateProfileCardsOnLoad() {
	cardCounter = 1;
	$(profileData).each(function() {
		var profileCard = '';
		profileCard += '<div class="profile-card">';
	    profileCard += '<span id="del-'+cardCounter+'" class="del-icon octicon octicon-trashcan"></span>';
	    profileCard += '<h4 id="profile-name-'+cardCounter+'">'+this.name+'</h4>';
	    profileCard += 'Source:<br><span id="profile-source-'+cardCounter+'">'+this.source+'</span><br><br>';
	    profileCard += 'Destination:<br><span id="profile-destination-'+cardCounter+'">'+this.destination+'</span>';
	    profileCard += '</div>';
	    cardCounter++;
	    // alert(profileCard);
	    $(".profile-container").append(profileCard);
	});
}

function generateProfileCardDynamic(name,source,destination,counterId) {
	var profileCard = '';
	profileCard += '<div class="profile-card" style="display:none">';
    profileCard += '<span id="del-'+counterId+'" class="del-icon octicon octicon-trashcan"></span>';
    profileCard += '<h4 id="profile-name-'+counterId+'">'+name+'</h4>';
    profileCard += 'Source:<br><span id="profile-source-'+counterId+'">'+source+'</span><br><br>';
    profileCard += 'Destination:<br><span id="profile-destination-'+counterId+'">'+destination+'</span>';
    profileCard += '</div>';
    cardCounter++;
    // alert(profileCard);
    $(".profile-container").append(profileCard);
    $("#profile-name-"+counterId).parent().fadeIn(1000);
}

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
		return false;
	}
	return true;
}

function submitAddProfileForm(e) {
  	e.preventDefault();
  	if(validations()) {
  		$("[id^=tmp-container]").each(function() {
  			var numericId = $(this).attr("id").split("-")[2]; 
  			var tmpObj = {};
  			tmpObj.name = ($("#profile-name-input-"+numericId).val());
  			tmpObj.source = ($("#source-input-"+numericId).val());
  			tmpObj.destination = ($("#destination-input-"+numericId).val());
  			profileData.push(tmpObj);
  		});
  		var objProfileData = {};
  		objProfileData.profiles = profileData;
  		fs.writeFile('userdata/profiles.json',JSON.stringify(objProfileData, null, 4),function(err) {
  			if (err) {
  				throw err;
  			}
  			$("[id^=tmp-container]").each(function() {
  				var numericId = $(this).attr("id").split("-")[2];
  				generateProfileCardDynamic($("#profile-name-input-"+numericId).val(),$("#source-input-"+numericId).val(),$("#destination-input-"+numericId).val(),cardCounter);
  				$(this).children(".remove-form").trigger("click");
  			});
  			$(".input-button").remove();
  		});
  		console.log(JSON.stringify(objProfileData));
  	}
}

function deleteCard() {
	var profileName = $(this).next().html();

	$(profileData).each(function(i) {
		if(this.name == profileName) {
			profileData.splice(i,1);
		}
	});

	var objProfileData = {};
	objProfileData.profiles = profileData;
  		fs.writeFile('userdata/profiles.json',JSON.stringify(objProfileData, null, 4),function(err) {
  			if (err) {
  				alert("An error occurred, exiting!");
  				throw err;
  				win.close();
  			}
  		});

	$(this).parent().fadeOut(500,function() {
		$(this).remove();
	});
}

function docReady() {

}

$(".profile-add-btn").click(addNewForm);
$("div").on("click",".remove-form",removeForm);
$("body").on("click",".input-folder",fillFolderInputs);
$( "#add-profile-form" ).submit(submitAddProfileForm);
$("body").on("click",".del-icon",deleteCard);
$("document").ready(docReady);
