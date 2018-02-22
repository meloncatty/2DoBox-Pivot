//Global Variables
var ideas = [];
var localStorageKey = "localStorageKey";
var count = 0;

//On load
$(document).ready(function() {
  grabIdea();
  limitItemDisplay();
  count = ideas.length;
})

//Idea constructor
function IdeaObjectCreator(saveIdeaTitle, saveIdeaBody) {
  this.title = saveIdeaTitle;
  this.body = saveIdeaBody;
  this.importanceCount = 0;
  this.displayCount++;
  this.importance = ['None', 'Low', 'Normal', 'High', 'Critical'];
  this.id = Date.now();
  this.completed = false;
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
$('#idea-placement').on('click', '.checkbox', toggleCompleted);
$('#idea-placement').on('click', '.up-arrow', upvoteImportance);
$('#idea-placement').on('click', '.down-arrow', downvoteImportance);
$('.showAllReadIdeas').on('click', prependCompletedTasks);
$('.search-section').on('click', '.criticalImportance', filterImportance);
$('.search-section').on('click', '.highImportance', filterImportance);
$('.search-section').on('click', '.normalImportance', filterImportance);
$('.search-section').on('click', '.lowImportance', filterImportance);
$('.search-section').on('click', '.noneImportance', filterImportance);
$('.showToDos').on('click', showMoreToDos);

// Template creator
function createTemplate(array) {
  array.forEach(function(object) {
    if (object.completed === false)
    $('#idea-placement').append(
      `<article aria-atomic="true" aria-label="Task card" class="object-container myVeryOwnSpecialHorizontalLine" id="${object.id}">
        <div class="flex-container">
          <p aria-label="Title of task" class="entry-title" contenteditable="true">${object.title}</p>
          <button class="delete-button" alt="delete idea" aria-label="Delete task"></button>
        </div>
        <p aria-label="Body of task" aria-atomic="true" class="entry-body" contenteditable="true">${object.body}</p>
        <button class="up-arrow" aria-label="Increase task importance"></button>
        <button class="down-arrow" aria-label="Decrease task importance"></button>
        <p class="quality-rank">importance: <span aria-atomic="true" class="open-sans">${object.importance[object.importanceCount]}</span></p>
        <span class="completed-button">completed &nbsp<input type="checkbox" class="checkbox"></span>
      </article>`
    );
  });
}

function displayNewestCard(object) {
    $('#idea-placement').prepend(
      `<article aria-atomic="true" aria-label="Task card" class="object-container myVeryOwnSpecialHorizontalLine" id="${object.id}">
        <div class="flex-container">
          <p aria-label="Title of task" class="entry-title" contenteditable="true">${object.title}</p>
          <button class="delete-button" alt="delete idea" aria-label="Delete task"></button>
        </div>
        <p aria-label="Body of task" aria-atomic="true" class="entry-body" contenteditable="true">${object.body}</p>
        <button class="up-arrow" aria-label="Increase task importance"></button>
        <button class="down-arrow" aria-label="Decrease task importance"></button>
        <p class="quality-rank">importance: <span aria-atomic="true" class="open-sans">${object.importance[object.importanceCount]}</span></p>
        <span class="completed-button">completed &nbsp<input type="checkbox" class="checkbox"></span>
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
  count = ideas.length;
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
  count = ideas.length;
}

// completed states
function toggleCompleted(){
  var id = $(this).parent().parent().attr('id');
  ideas.forEach(function(object) {
    if (object.id == id) {
        object.completed = !object.completed;
        storeIdeas();
    }
  });
  $(this).parent().toggleClass('completed-state');
  $(this).parent().siblings().toggleClass('completed-state');
  $(this).parent().siblings().find('.entry-title').toggleClass('completed-state');
};

//prepend completed to-dos
function prependCompletedTasks() {
  ideas.forEach(function(object) {
    if (object.completed == true)
    $('#idea-placement').prepend(
      `<article aria-atomic="true" aria-label="Task card" class="object-container myVeryOwnSpecialHorizontalLine" id="${object.id}">
        <div class="flex-container completed-state">
          <p aria-label="Title of task" class="entry-title completed-state" contenteditable="true">${object.title}</p>
          <button class="delete-button" alt="delete idea" aria-label="Delete task"></button>
        </div>
        <p aria-label="Body of task" aria-atomic="true" class="entry-body completed-state" contenteditable="true">${object.body}</p>
        <button class="up-arrow completed-state" aria-label="Increase task importance"></button>
        <button class="down-arrow completed-state" aria-label="Decrease task importance"></button>
        <p class="quality-rank completed-state">importance: <span aria-atomic="true" class="open-sans">${object.importance[object.importanceCount]}</span></p>
        <span class="completed-button completed-state">completed &nbsp<input type="checkbox" class="checkbox" checked></span>
      </article>`
    );
  });
};

//local storage
function storeIdeas() {
  var stringIdeas = JSON.stringify(ideas);
  localStorage.setItem(localStorageKey, stringIdeas);
};

// Arrow button functionality
//pull out the anonymous function and make named function
// $('#idea-placement').on('click', '.up-arrow', function() {
//   var thisIdeaQuality = $(this).closest('button').siblings('p').children(
//     'span');
//   upVoteIdea(thisIdeaQuality);
// });

// function upVoteIdea(ideaQuality) {
//   if (ideaQuality.text() == 'swill') {
//     ideaQuality.text('plausible');
//   } else if (ideaQuality.text() == 'plausible') {
//     ideaQuality.text('genius');
//   };
// };

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
  }
}

function upvoteImportance() {
  var thisIdeaImportance = $(this).siblings('p').children('span');
  console.log();
  var id = $(this).parent().attr('id');
  for (var i = 0; i < ideas.length; i++) {
    if (id == ideas[i].id && ideas[i].importanceCount < 4) {
      ideas[i].importanceCount++;
      thisIdeaImportance.text(ideas[i].importance[ideas[i].importanceCount]);
    };
  storeIdeas();
  }
}

function filterImportance() {
  var grabAllText = $('.object-container').text();
  grabAllText = grabAllText.trim().split(' ');
  var buttonText = this.innerHTML;
  var specialArr = [];
  ideas.filter((a) => a.importance[a.importanceCount].includes(buttonText) ? specialArr.push(a) : a);
  $('#idea-placement').html(' ');
  createTemplate(specialArr);
}

function limitItemDisplay() {
  var count = count;
  if(ideas.length > 10) {
    count = 10;
  }
  var reversedIdeas = ideas.reverse();
  var filteredIdeas = reversedIdeas.filter(function(obj) {
    return obj.completed == false;
  })
  var limitedIdeas = filteredIdeas.slice(0, count).map(function(obj) {
    return obj;
  })
  createTemplate(limitedIdeas);
}

function showMoreToDos() {
  count = count+10;
  var reversedIdeas = ideas.reverse();
  var filteredIdeas = reversedIdeas.filter(function(obj) {
    return obj.completed == false;
  })
  var limitedIdeas = filteredIdeas.slice(0, count).reverse().map(function(obj) {
    return obj;
  })
  $('#idea-placement').html(' ');
  createTemplate(limitedIdeas);
}

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
