$(document).ready(function() {
  $("#form").hide();

  $("#submit").on("click", function(e) {
    $("#form").slideToggle("slow");
  });

  function website(str) {
    for (var i = 7; i < str.length; i++) {
      if (str[i] + str[i + 1] + str[i + 2] + str[i + 3] === "www.") {
        var value = str.split("www.");
        return value[value.length - 1];
      } else {
        var http = str.split("//");
        return http[http.length - 1];
      }
    }
  }

  $("#form").on("submit", function(e) {
    //Check to see if URL is valid

    var title = $("input")
      .eq(0)
      .val();
    var url = $("input")
      .eq(1)
      .val();

    var cleanurl = website(url);
    var newLi = `<li><a href='#' class="fa fa-star-o"></a> <b>${title}</b> <span>(${cleanurl})</span></li>`;
    //If yes, append

    if (url !== "") {
      $(".urlLinks").append(newLi);
      $("#form").slideToggle("slow");

      $("#form").trigger("reset");
    }
  });

  //Fill in Star Code
  //target each list item star icon
  //if clicked
  //if empyty then fill
  //if full then empty it

  $("ol").on("click", "a", function(e) {
    // e.preventDefault();
    $(e.target).toggleClass("fa fa-star fa fa-star-o");
// if ($(e.target).hasClass("fa-star")) {
//   $(e.target).css("color", "gray");
// } else {
//   $(e.target).css("color", "black");
// }
  });

  //if click favorites
  //filter list items for those wil 'PP' icon
  //switch the navbar text to all
  //if click all
  //remove filter
  //switch nave to favorites

  var onOrOff = 0;
  var listAll = 0;
  $("#favoriteList").on("click", function(e) {
    if (listAll === 0) {
      $("#favoriteList").text("All");
      listAll = 1;
    } else {
      $("#favoriteList").text("Favorites");
      listAll = 0;
    }

    if (onOrOff === 0) {
      $(".urlLinks li a[class='fa fa-star-o']")
        .parent()
        .hide();
      onOrOff = 1;
    } else {
      $(".urlLinks li a[class='fa fa-star-o']")
        .parent()
        .show();
      onOrOff = 0;
    }
  });

  $(".websiteLink").on("click", function(e) {});
});
