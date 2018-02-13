var ideas = [];
var localStorageKey = "ideas";

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
  var stringIdeas = JSON.stringify(ideas);
  localStorage.setItem(localStorageKey, stringIdeas);
}

function grabIdea () {
 var storedIdeas = JSON.parse(localStorage.getItem(localStorageKey));
 ideas = storedIdeas;


}

//Event Listeners
$('#save-btn').on('click', attachTemplate);

// template function, 
function createTemplate() {
  $('#idea-placement').html('');
  ideas.forEach(function(object) {
    $('#idea-placement').append (`
      <article class="object-container" id="${object}">
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


 
  // console.log(idNumber)
  // ideas.unshift(idNumber); 
  saveIdea();
  createTemplate(); 
  // var stringIdeas = JSON.stringify(ideas);
  // localStorage.setItem(idNumber.id, stringIdeas);
  clearInputs();
  }

// clear inputs
function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}
  
//Delete Card
$('#idea-placement').on('click', '.delete-button', deleteIdea);

function deleteIdea() {
  var grandParentId = $(this).parent().parent().attr('id');
  localStorage.removeItem(grandParentId);
  $(this).parent().parent().remove();
  console.log(grandParentId);
}  

$('#idea-placement').on('click', '.up-arrow', function () {
  var thisIdeaQuality = $(this).children('.open-sans');
  console.log(thisIdeaQuality);
  upVoteIdea(thisIdeaQuality);
});

function upVoteIdea(ideaQuality) {
  if (ideaQuality.text() == 'swill') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('genius');
  } 
}

// upvote toggle between 3 values
// downvote toogle between 3 values
// delete existing card and from local storage
// existing should editable
// search functionality