$(function() {
  //load stories

  $.getJSON("https://hack-or-snooze.herokuapp.com/stories").then(function(
    response
  ) {
    response.data.forEach(function(value, index, array) {
      var $newTitle = $("<a>", {
        addClass: "px-3 text-dark",
        css: { "text-decoration": "none" },
        attr: { href: array[index].url, target: "_blank" },
        text: array[index].title
      });

      var $newDomain = $("<a>", {
        addClass: "text-muted small",
        text: "(" + getDomain(array[index].url) + ")"
      });

      var $newLi = $("<li>", {
        addClass: "list-group-item",
        attr: { id: array[index].storyId },
        css: { display: "list-item" }
      });

      //append parts of list item together to create complete item
      $newLi.append('<i class="fa fa-star-o" aria-hidden="true"></i>');
      $newLi.append($newTitle);
      $newLi.append($newDomain);

      //append new list item to document
      $("ol").append($newLi);
    });
  });

  // create a user
  // id - #createNewUser
  // on form submit #createNewUser (event listener needed), name - #newName , userName - #newUserName, password - #newPassword
  // POST request

  //login user function
  function loginUser() {
    console.log($username);
    $.ajax({
      url: "https://hack-or-snooze.herokuapp.com/auth",
      method: "POST",
      data: {
        data: {
          username: $username,
          password: $password
        }
      }
    }).then(function(response) {
      $token = response.data.token;
      localStorage.setItem("username", $username);
      localStorage.setItem("token", $token);
      console.log(response);
    });
  }

  //global scope -- declare username and password vars
  let $username;
  let $password;
  let $token = localStorage.getItem("token");

  // create a user
  const $createNewUser = $("#createNewUser");

  $createNewUser.on("submit", function(e) {
    e.preventDefault();

    let $newName = $("#newName").val();
    let $newUserName = $("#newUserName").val();
    let $newPassword = $("#newPassword").val();

    $.ajax({
      url: "https://hack-or-snooze.herokuapp.com/users",
      method: "POST",
      data: {
        data: {
          name: $newName,
          username: $newUserName,
          password: $newPassword
        }
      }
    }).then(function(response) {
      $username = $newUserName;
      $password = $newPassword;

      loginUser();
    });
  });

  //click login to login user
  //this calls loginUser function
  const $login = $("#login");

  $login.on("click", function(e) {
    e.preventDefault();

    $username = $("#username").val();
    $password = $("#password").val();

    loginUser();
  });

  //create login function
  //check local storage for token
  //if token
  //login
  //if no token
  //login and get token

  //POST request
  //made to /auth -- https://hack-or-snooze.herokuapp.com/auth
  //include data:data{} object
  //username
  //password
  //expect receive token
  //save to local storage

  var $form = $("#needs-validation");

  //submit a news story
  $(".submitItem").on("click", "button#submit", function(e) {
    if ($form[0].checkValidity() === false) {
      $form[0].reportValidity();
      e.preventDefault();
      e.stopPropagation();
    } else {
      $form.addClass("was-validated");

      e.preventDefault();

      //get field values
      var titleInput = $("input#title").val();
      var authorInput = $("input#author").val();
      var urlInput = $("input#url").val();

      console.log(localStorage.getItem("username"));
      console.log(titleInput);
      console.log(authorInput);
      console.log(urlInput);

      $.ajax({
        url: "https://hack-or-snooze.herokuapp.com/stories",
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        data: {
          data: {
            username: JSON.parse(atob($token.split(".")[1])).username,
            title: titleInput,
            author: authorInput,
            url: urlInput
          }
        }
      }).then(function() {
        console.log($username);
        //create jQuery object for display
        var $newTitle = $("<a>", {
          addClass: "px-3 text-dark",
          css: { "text-decoration": "none" },
          attr: { href: urlInput, target: "_blank" },
          text: titleInput
        });

        var $newDomain = $("<a>", {
          addClass: "text-muted small",
          text: "(" + getDomain(urlInput) + ")"
        });

        var $newLi = $("<li>", {
          addClass: "list-group-item",
          css: { display: "list-item" }
        });

        //append parts of list item together to create complete item
        $newLi.append('<i class="fa fa-star-o" aria-hidden="true"></i>');
        $newLi.append($newTitle);
        $newLi.append($newDomain);

        //prepend new list item to document
        $("ol").prepend($newLi);

        //reset submit form
        urlInput = "";
        titleInput = "";
        $(".dropdown-toggle").dropdown("toggle");

        //check if favorite filter active & display new item accordingly
        if ($("#toggleFeed").text() === "all") {
          $newLi.addClass("d-none");
        }
      });
    }
  });

  //toggle favorite mark

  $("ol").on("click", "i", function(e) {
    var $star = $(e.target);
    $star.toggleClass("favorite");

    if ($star.hasClass("favorite")) {
      $star.removeClass("fa-star-o").addClass("fa-star text-warning");
    } else {
      $star.removeClass("fa-star text-warning").addClass("fa-star-o");
    }
  });

  //filter by favorite
  $("#toggleFeed").on("click", function(e) {
    if ($(e.target).text() === "favorites") {
      $("li").addClass("d-none");
      $favorites = $("ol")
        .find("i.favorite")
        .parent();
      $favorites.removeClass("d-none");

      $(e.target).text("all");
    } else {
      $("li").removeClass("d-none");
      $(e.target).text("favorites");
    }
  });

  //get domain name

  function getDomain(data) {
    var a = document.createElement("a");
    a.href = data;
    return a.hostname;
  }

  //filter by domain name

  $("ol").on("click", "a.small", function(e) {
    var domainSelected = $(e.target).text();
    $allMatchingDomains = $("a:contains(" + domainSelected + ")").parent();
    $("li").addClass("d-none");
    $allMatchingDomains.removeClass("d-none");
    $("#toggleFeed").text("all");
  });
});
