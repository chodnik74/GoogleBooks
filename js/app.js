$( document ).ready(function() {
    var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=10&startIndex=";
    var $books = $("#books");
    var indexBook = 0;
    var clearfixIndex = 0;
    var block = false;
    function getBooks() {
        // Zabrání opětovnému volání funkce před dokončením AJAXu
        if (block) return;
 
        // Zablokuje funkci
        block = true;
        //alert(indexBook);
        var googlebooksAPI = apiUrl + indexBook;
 
        $.getJSON(googlebooksAPI, function(response) {
            var volumeInfo;
            var item;
            var clearfix;
            if (response.items.length < 10) {
                alert("Error in load 10 items");
            }
 
            for (var i = 0; i < response.items.length; i++) {
              item = response.items[i];
              volumeInfo = item.volumeInfo;
              clearfix = "";
              if (indexBook % 2 == 0) {
                clearfix = "<div class='clearfix visible-sm visible-md visible-lg'></div>";
              } else {
                clearfix = "";
              }
              indexBook++;
 
              $books.html( $books.html() + clearfix + "<div class='col-xs-12 col-sm-6'>" +
                "<div class='books-item'>" +
                "<div class='books-item-title'>" + (volumeInfo.title ? volumeInfo.title : "- / -")  + "</div>" +
                "<div class='books-item-images'>" + (volumeInfo.imageLinks ? ("<img src='" + volumeInfo.imageLinks.thumbnail + "'>") : "no thumbnail") + "</div>" +
                "</div>" +
                "</div>");
            }
            console.log(response);
            //console.log("Old index: " + indexBook);
            indexBook += 10;
            //console.log("News index: " + indexBook);
        }).always(function() {
            // Odblokuje funkci po dokončení dotazu nebo při chybě
            block = false;
        });
    }
 
    $(".morebooks").click(function(){
        getBooks();
    });
 
    getBooks();
});