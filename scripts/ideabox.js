
var ideas = [];

function ideaObjectCreator(saveIdeaTitle, saveIdeaBody){
  this.title = saveIdeaTitle;
  this.body  = saveIdeaBody;
  this.quality = 'swill';
  this.id = Date.now();
}

function saveIdea () {
  var stringIdeas = JSON.stringify(ideas);
    localStorage.setItem("Idea Item", stringIdeas);
}

function grabIdea () {
  var storedIdea = localStorage.getItem("Idea Item") || '[]';;
  var parsedIdea = JSON.parse(storedIdea);
  ideas = parsedIdea;
}
  

//on page load this will grab idea from local storage and place it.
$(document).ready(function() {
  grabIdea();
  attachTemplate();

})


//Event Listeners
$('#save-btn').on('click', attachTemplate);


// make a template function
//refactor 
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
        <p class="quality-rank">quality: <span class="open-sans">swill</span></p>
        </article>`);
});

}
// prepend the template function
function attachTemplate() {
  event.preventDefault();
 var saveIdeaTitle = $('#title-field').val();
 var saveIdeaBody = $('#body-field').val();
 var ideaCard = new ideaObjectCreator(saveIdeaTitle, saveIdeaBody);
  ideas.unshift(ideaCard); 
    saveIdea();
    createTemplate(); 
    clearInputs();
  }
// clear inputs
function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}

//Contructor function saves card data


// when user clicks the save button ideas save to local storage

// on page load grab from local storage
// upvote toggle between 3 values
// downvote toogle between 3 values
// delete existing card and from local storage
// existing should editable
// search functionality
//plugins