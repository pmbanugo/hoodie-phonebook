$('#contactForm').submit(function(event) {
  // prevent page reload
  event.preventDefault();

  var name = $('#name').val();
  var email = $('#email').val();
  var mobile = $('#mobile').val();

  // Save the contact to the database with Hoodie
  hoodie.store.add({
    name: name,
    mobile: mobile,
    email: email
  });

  $('#contactForm')[0].reset();
});

$('#signup').click(function (event) {
  signUp();
});

$('#signin').click(function (event) {
  signIn();
});

$('#signout').click(function (event) {
  signOut();
});

if (hoodie.account.isSignedIn()) {
  showAuthenticated();
} else {
  showAnonymous();
}

// when the site loads in the browser,
// we load all previously saved contacts from hoodie
loadContacts();

//when a new entry is added to the database, run the corresponding function
hoodie.store.on('add', addNewContactToList);

function loadContacts() {
  hoodie.store.findAll().then(function(contacts) {
    var tbody = '';
    $.each(contacts, function (i, contact) {
      var row = '<tr><td>' + contact.name + '</td><td>' + contact.mobile + '</td><td>' + contact.email + '</td></tr>';
      tbody += row;
    });

    $("#contactList tbody").html('').html(tbody);
  });
}

function addNewContactToList(contact) {
  var newContact = '<tr><td>' + contact.name + '</td><td>' + contact.mobile + '</td><td>' + contact.email + '</td></tr>'
  $("#contactList tbody").append(newContact);
}

function signUp() {
  var username = prompt('username');
  var password = prompt('password');
  hoodie.account.signUp({
    username: username,
    password: password
  })
    .then(function() {
      return hoodie.account.signIn({
        username: username,
        password: password
      });
    })
    .then(function() {
      showAuthenticated();
    })
    .catch(function(errror) {
      alert('Ooops, something went wrong: ' + error.message);
    })
}

function signIn(){
  var username = prompt('username');
  var password = prompt('password');

  hoodie.account.signIn({
    username: username,
    password: password
  })
  .then(function() {
    showAuthenticated();
  })
  .catch(function(error) {
      alert('ooops: ' + error.message);
    });
}

function signOut(){
  hoodie.account.signOut()
  .then(function() {
    showAnonymous();
  })
  .catch(function(error) {
      alert('ooops: ' + error.message);
    });
}

function showAuthenticated(){
  $('#username').text('signed in as ' + hoodie.account.username);
  $('#authenticated').show();
  $('#anonymous').hide();
}

function showAnonymous(){
  $('#authenticated').hide();
  $('#anonymous').show();
}
