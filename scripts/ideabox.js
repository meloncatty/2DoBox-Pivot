var ideas = [];
var localStorageKey = "localStorageKey";


$(document).ready(function() {
  grabIdea();
  createTemplate();
})

function IdeaObjectCreator(saveIdeaTitle, saveIdeaBody){
  this.title = saveIdeaTitle;
  this.body  = saveIdeaBody;
  this.quality = 'swill';
  this.id = Date.now();
}

function saveIdea () {
  var saveIdeaTitle = $('#title-field').val();
  var saveIdeaBody = $('#body-field').val();
  var idNumber = new IdeaObjectCreator(saveIdeaTitle, saveIdeaBody);
  ideas.push(idNumber);
  console.log(ideas);
  var stringIdeas = JSON.stringify(ideas);
  localStorage.setItem(localStorageKey, stringIdeas);
}

function grabIdea () {
  var storedIdea = localStorage.getItem(localStorageKey);
  var parsedIdea = JSON.parse(storedIdea);
  console.log(parsedIdea);
  ideas = parsedIdea || [];
}

//Event Listeners
$('#save-btn').on('click', attachTemplate);

// template function, 
function createTemplate() {
  $('#idea-placement').html('');
  ideas.forEach(function(object) {
    $('#idea-placement').prepend (`
      <article class="object-container" id="${object.id}">
        <div class="flex-container">
          <h2 class="editable">${object.title}</h2>
          <div class="delete-button"></div>
        </div>
        <p class="editable">${object.body}</p>
        <div class="up-arrow"></div>
        <div class="down-arrow"></div>
        <p class="quality-rank">quality: <span class="open-sans">${object.quality}</span></p>
      </article>`);
  });
}

// prepend the template function
function attachTemplate() {
  event.preventDefault();
  saveIdea();
  grabIdea();
  createTemplate(); 
  clearInputs();
  }

// clear inputs
function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}
  
// Events
$('#idea-placement').on('click', '.delete-button', deleteIdea);
$('#idea-placement').on('click', '.up-arrow', upVoteIdeaStorage);
$('#idea-placement').on('click', '.down-arrow', downVoteIdeaStorage);

function deleteIdea() {  
  var grandParentId = $(this).parent().parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id
    if (grandParentId == ideaId) {
      ideas.splice(i, 1);
      var stringIdeas = JSON.stringify(ideas);
      localStorage.setItem(localStorageKey, stringIdeas);
    }
  }
  $(this).parent().parent().remove();
} 

$('#idea-placement').on('click', '.up-arrow', function () {
  var thisIdeaQuality = $(this).closest('div').siblings('p').children('span');
  upVoteIdea(thisIdeaQuality);
});

function upVoteIdea(ideaQuality) {
  if (ideaQuality.text() == 'swill') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('genius');
  } 
}

$('#idea-placement').on('click', '.down-arrow', function () {
  var thisIdeaQuality = $(this).siblings('p').children('span');
  downVoteIdea(thisIdeaQuality);
});

function downVoteIdea(ideaQuality) {
  if (ideaQuality.text() == 'genius') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('swill');
  } 
}

function upVoteIdeaStorage(ideaQuality) {
  var grandParentId = $(this).parent()[0].id;
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id;
    if (grandParentId == ideaId && ideas[i].quality == 'swill') {
      ideas[i].quality = 'plausible';
    } else if (grandParentId == ideaId && ideas[i].quality == 'plausible') {
      ideas[i].quality = 'genius';
    }
      var stringIdeas = JSON.stringify(ideas);
      localStorage.setItem(localStorageKey, stringIdeas);
  }
}

function downVoteIdeaStorage(ideaQuality) {
  var grandParentId = $(this).parent()[0].id;
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id;
     if (grandParentId == ideaId && ideas[i].quality == 'genius') {
      ideas[i].quality = 'plausible';
    } else if (grandParentId == ideaId && ideas[i].quality == 'plausible') {
      ideas[i].quality = 'swill';
    }
      var stringIdeas = JSON.stringify(ideas);
      localStorage.setItem(localStorageKey, stringIdeas);
  }
}



// upvote toggle between 3 values
// downvote toogle between 3 values
// delete existing card and from local storage
// existing should editable
// search functionality