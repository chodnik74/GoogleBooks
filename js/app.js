$(document).ready(function () {
    var $books = $("#books");
    var $btn = $(".morebooks");
    var indexBook = 0;
    var block = false;

    function blockBtn() {
        block = true;
        //$btn.hide(); // Místo toho přebarvit btn - změnit class 
        $btn.addClass("disabled");
    }

    function unblockBtn() {
        block = false;
        $btn.removeClass("disabled");
    }

    function getBooks(count, index) {
        if (!count) count = 10; // Pokud není nastaven count nebo pokud je 0, false, null
        if (!index) index = indexBook; // Pokud není index nastaven, použije se počítadlo z rodičovského scope

        // Zabrání opětovnému volání funkce před dokončením AJAXu
        if (block) return;

        // Zablokuje funkci
        blockBtn();

        $.getJSON("https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=" + count + "&startIndex=" + index, function (response) {
            var volumeInfo;
            var item;
            var clearfix;
            
            for (var i = 0; i < response.items.length; i++) {
                item = response.items[i];
                volumeInfo = item.volumeInfo;
                clearfix = "";

                if (indexBook % 2 == 0) {
                    clearfix = "<div class='clearfix visible-sm visible-md visible-lg'></div>";
                }

                $books.html($books.html() + clearfix + "<div class='col-xs-12 col-sm-6'>" +
                  "<div class='books-item'>" +
                  "<div class='books-item-title'>" + (volumeInfo.title ? volumeInfo.title : "- / -") + "</div>" +
                  "<div class='books-item-images'>" + (volumeInfo.imageLinks ? ("<img src='" + volumeInfo.imageLinks.thumbnail + "'>") : "no thumbnail") + "</div>" +
                  "</div>" +
                  "</div>");

                indexBook++;
            }

            if (response.items.length < count) {
                console.log(response);
                console.log("Error in loading, try to catch all 10 items..");
                block = false;
                getBooks(count - response.items.length, index + response.items.length);
                return;
            }
        }).always(function () {
            // Odblokuje funkci po dokončení dotazu nebo při chybě
            unblockBtn();
        });
    }

    $btn.click(function () {
        getBooks();
    });

    getBooks();
});