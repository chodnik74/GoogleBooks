$( document ).ready(function() {
    var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=9&startIndex=";
    var $books = $("#books");
    var indexBook = 0;
    var block = false;
 
    function getBooks() {
        // Zabrání opětovnému volání funkce před dokončením AJAXu
        if (block) return;
 
        // Zablokuje funkci
        block = true;
 
        var googlebooksAPI = apiUrl + indexBook;
 
        $.getJSON(googlebooksAPI, function(response) {
            var volumeInfo;
            var item;
            var clearfix;
            // nebo v jednom řádku:
            //var volumeInfo, item, clearfix;
 
            for (var i = 0; i < response.items.length; i++) {
              item = response.items[i];
              volumeInfo = item.volumeInfo;
              clearfix = "";
 
              if (i % 3 == 0) {
                clearfix = "<div class='clearfix visible-sm visible-md visible-lg'></div>";
              }
 
              $books.html( $books.html() + clearfix + "<div class='col-xs-12 col-sm-4'>" +
                "<div class='books-item'>" +
                "<div class='books-item-title'>" + (volumeInfo.title ? volumeInfo.title : "- / -")  + "</div>" +
                "<div class='books-item-images'>" + (volumeInfo.imageLinks ? ("<img src='" + volumeInfo.imageLinks.thumbnail + "'>") : "no thumbnail") + "</div>" +
                "</div>" +
                "</div>");
            }
            indexBook += 9;
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