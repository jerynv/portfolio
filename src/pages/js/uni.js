import {
  appendXHR,
  cssLoader,
  jsLoader
} from './compLoader.js';
import {
  getIcon
} from './icon.js';

$(function () {
  $(".navbar").load("../components/navbar.html");
  //load navbar css
  $("head").append('<link rel="stylesheet" href="../css/navbar.css">');
  $("head").append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
  $("head").append(` <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></scr`)
}).ajaxStop(function () {
  const url = new URL(window.location.href);
  const path = url.pathname;

  // Set active class for navbar
  $(".nav-link").each(function () {
    var href = $(this).attr("page");
    if (href == path) {
      $(this).addClass("active");
    } else if (path == "/") {
      //get element with attr page = /
      $(".nav-link[page='/']").addClass("active");
    }
  });
});

//remove loader elements 


//miscelanouse component loading
$(document).ready(function () {
  cssLoader("../css/variables.css");
  jsLoader("../js/FakeUrl.js");
  appendXHR("../components/socials.html", $(".socials"));
});

$(document).ready(function () {
  // Use event delegation for .nav-link elements
  $(document).on("click", ".nav-link", function () {
    var attr = $(this).attr("page");
    // Directly use the 'send' attribute as the URL to navigate to
    if (attr) {
      window.location.href = attr;
    } else {
      console.log("'page' attribute is missing or empty.");
    }
  });
});

$(document).ready(function () {
  // Use event delegation for .nav-link elements
  $(document).on("click", ".fa", function () {
    var attr = $(this).attr("link");
    // Directly use the 'send' attribute as the URL to navigate to
    if (attr) {
      //open in new tab
      window.open(attr, '_blank');
    } else {
      console.log("'page' attribute is missing or empty.");
    }
  });
});

$(document).ready(function () {
  $(".icon").each(async function () {
    const iconName = $(this).attr("icon");
    const append = $(this).attr("append");
    let icon = await getIcon(iconName);
    if (append) {
      $(this).append(icon);
    } else {
      $(this).html(icon);
    }
  });
});