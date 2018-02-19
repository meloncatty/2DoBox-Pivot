//Local Variables
var ideas = [];
var localStorageKey = "localStorageKey";

//On load
$(document).ready(function() {
  grabIdea();
  createTemplate();
})

//Idea constructor
function IdeaObjectCreator(saveIdeaTitle, saveIdeaBody) {
  this.title = saveIdeaTitle;
  this.body = saveIdeaBody;
  this.importanceCount = 0;
  this.importance = ['None', 'Low', 'Normal', 'High', 'Critical'];
  this.quality = 'swill';
  this.id = Date.now();

}

// Saves idea and updates local storage array
function saveIdea() {
  var saveIdeaTitle = $('#title-field').val();
  var saveIdeaBody = $('#body-field').val();
  var object = new IdeaObjectCreator(saveIdeaTitle, saveIdeaBody);
  ideas.push(object);
  displayNewestCard(object);
  console.log(ideas);
  var stringIdeas = JSON.stringify(ideas);
  localStorage.setItem(localStorageKey, stringIdeas);
}

//Grabs idea out of local storage and updates array
function grabIdea() {
  var storedIdea = localStorage.getItem(localStorageKey);
  var parsedIdea = JSON.parse(storedIdea);
  console.log(parsedIdea);
  ideas = parsedIdea || [];
}

//Event Listeners
$('#save-btn').on('click', attachTemplate);
$('#save-btn').on('click', disableSave);
$('.input-fields').on('keyup', enableSave);
$('#idea-placement').on('click', '.delete-button', deleteIdea);

// Template creator
function createTemplate() {
  ideas.forEach(function(object) {
    $('#idea-placement').prepend(
      `
      <article aria-atomic="true" aria-label="Task card" class="object-container myVeryOwnSpecialHorizontalLine" id="${object.id}">
        <div class="flex-container">
          <p aria-label="Title of task" class="entry-title" contenteditable="true">${object.title}</p>
          <button class="delete-button" alt="delete idea" aria-label="Delete task"></button>
        </div>
        <p aria-label="Body of task" aria-atomic="true" class="entry-body" contenteditable="true">${object.body}</p>
        <button class="up-arrow" aria-label="Increase task importance"></button>
        <button class="down-arrow" aria-label="Decrease task importance"></button>
        <p class="quality-rank">importance: <span aria-atomic="true" class="open-sans">${object.importance[object.importanceCount]}</span></p>
      </article>`
    );
  });
}

function displayNewestCard(object) {
    $('#idea-placement').prepend(
      `
      <article aria-atomic="true" aria-label="Task card" class="object-container myVeryOwnSpecialHorizontalLine" id="${object.id}">
        <div class="flex-container">
          <p aria-label="Title of task" class="entry-title" contenteditable="true">${object.title}</p>
          <button class="delete-button" alt="delete idea" aria-label="Delete task"></button>
        </div>
        <p aria-label="Body of task" aria-atomic="true" class="entry-body" contenteditable="true">${object.body}</p>
        <button class="up-arrow" aria-label="Increase task importance"></button>
        <button class="down-arrow" aria-label="Decrease task importance"></button>
        <p class="quality-rank">importance: <span aria-atomic="true" class="open-sans">${object.importance[object.importanceCount]}</span></p>
      </article>`
    );
  };

// enable save button
function enableSave() {
  var titleFieldValue = $('#title-field').val();
  var bodyFieldValue = $('#body-field').val();
  var $saveBtn = $('.save-button');
  if (titleFieldValue !== '' && bodyFieldValue !== '') {
    $saveBtn.prop('disabled', false);
  } else {
    $saveBtn.prop('disabled', true);
  }
}

// disable save button 
function disableSave() {
  $('.save-button').prop('disabled', true);
};

// prepend the template function
function attachTemplate() {
  event.preventDefault();
  saveIdea();
  grabIdea();
  clearInputs();
}

// clear inputs
function clearInputs() {
  $('#title-field').val('');
  $('#body-field').val('');
  $('#title-field').focus();
}

function deleteIdea() {
  var grandParentId = $(this).parent().parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    var ideaId = ideas[i].id
    if (grandParentId == ideaId) {
      ideas.splice(i, 1);
      storeIdeas();
    }
  }
  $(this).parent().parent().remove();
}

//local storage

function storeIdeas() {
  var stringIdeas = JSON.stringify(ideas);
  localStorage.setItem(localStorageKey, stringIdeas);
};

// Arrow button functionality
//pull out the anonymous function and make named function
$('#idea-placement').on('click', '.up-arrow', function() {
  var thisIdeaQuality = $(this).closest('button').siblings('p').children(
    'span');
  upVoteIdea(thisIdeaQuality);
});

function upVoteIdea(ideaQuality) {
  if (ideaQuality.text() == 'swill') {
    ideaQuality.text('plausible');
  } else if (ideaQuality.text() == 'plausible') {
    ideaQuality.text('genius');
  }
}

$('#idea-placement').on('click', '.down-arrow', downvoteImportance);

function downvoteImportance() {
  var thisIdeaImportance = $(this).siblings('p').children('span');
  var id = $(this).parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    if (id == ideas[i].id && ideas[i].importanceCount > 0) {
      ideas[i].importanceCount--;
      thisIdeaImportance.text(ideas[i].importance[ideas[i].importanceCount]);
      console.log();
    };
  storeIdeas();
}}

$('#idea-placement').on('click', '.up-arrow', upvoteImportance);

function upvoteImportance() {
  var thisIdeaImportance = $(this).siblings('p').children('span');
  var id = $(this).parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    if (id == ideas[i].id && ideas[i].importanceCount < 4) {
      ideas[i].importanceCount++;
      thisIdeaImportance.text(ideas[i].importance[ideas[i].importanceCount]);
      console.log();
    };
  storeIdeas();
}}

//Search function and Event
$('#search-field').on('keyup', function() {
  var searchInput = $('#search-field').val();
  var searcher = new RegExp(searchInput, 'gim');
  $('.object-container').each(function() {
    var title = $(this).find(".entry-title").text();
    var body = $(this).find(".entry-body").text();
    var match = (title.match(searcher) || body.match(searcher));
    if (!match) {
      $(this).hide();
    } else {
      $(this).show();
    }
  })
});

// Editable
$('#idea-placement').on('blur', '.entry-title', function(e) {
    var newTitle = $(this).text();
    editableTitle(this, newTitle);
});

function editableTitle(location, newText) {
    var objectId = $(location).parent().parent().attr('id');
    ideas = JSON.parse(localStorage.getItem(localStorageKey));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.title = newText;
            return object.title;
        }
    });
    stringIdeas = JSON.stringify(ideas);
    localStorage.setItem(localStorageKey, stringIdeas);
}

$('#idea-placement').on('blur', '.entry-body', function(e) {
    var newBody = $(this).text();
    editableBody(this, newBody);
});

function editableBody(location, newText) {
    var objectId = $(location).parent().attr('id');
    ideas = JSON.parse(localStorage.getItem(localStorageKey));
    ideas.forEach(function(object) {
        if (object.id == objectId) {
            object.body = newText;
            return object.body;
        }
    });
    stringIdeas = JSON.stringify(ideas);
    localStorage.setItem(localStorageKey, stringIdeas);
}

// Expanding Text Area
// var expandingTextArea = (function(){
//   var textAreaTag = document.querySelectorAll('textarea')
//   for (var i=0; i<textAreaTag.length; i++){
//     textAreaTag[i].addEventListener('paste',autoExpand);
//     textAreaTag[i].addEventListener('input',autoExpand);
//     textAreaTag[i].addEventListener('keyup',autoExpand);
//   }
//   function autoExpand(e,el){
//     var el = el || e.target;
//     el.style.height = 'inherit';
//     el.style.height = el.scrollHeight+'px';
//   }
// });
