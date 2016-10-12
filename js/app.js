$(document).ready(function () {
    var $books = $("#books");
    var $btn = $(".morebooks");
    var indexBook = 0;
    var block = false;
    var recall = false;

    function blockBtn() {
        block = true;
        $btn.addClass("disabled");
    }

    function unblockBtn() {
        block = false;
        $btn.removeClass("disabled");
    }

    function getBooks(count, index) {
        // Zabrání opětovnému volání funkce před dokončením AJAXu
        if (block && !recall) return;
        recall = false; //Pro potřebu interního znovuzavolání
        blockBtn();

        if (!count) count = 10; // Pokud není nastaven count nebo pokud je 0, false, null
        if (!index) index = indexBook; // Pokud není index nastaven, použije se počítadlo z rodičovského scope

        var originalCount = count;

        if (count == 1) count = 2; // Google nechce vracet pouze jednu položku

        $.getJSON("https://www.googleapis.com/books/v1/volumes?q=javascript&key=AIzaSyAXdxLtzZneUFXbWDt_TjbJMKhEIdGcYcQ&maxResults=" + count + "&startIndex=" + index, function (response) {
            var volumeInfo;
            var item;
            var clearfix;
            var responseItemCount = 0;

            console.log(response);

            if (response.items && response.items.length > 0) {
                responseItemCount = response.items.length;

                // Pokud v důsledku fixu počtu dojde více položek než bylo žádáno, ořízneme příchozí data
                if (responseItemCount > originalCount) {
                    responseItemCount = originalCount;
                }
            }

            for (var i = 0; i < responseItemCount; i++) {
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

            // Pokud neodpovídá počet záznamů (chyba v google books API), načteme chybějící zbytek
            if (responseItemCount < originalCount) {
                console.log("Error in loading, try to catch all 10 items..");

                recall = true;
                getBooks(originalCount - responseItemCount, index + originalCount);

                return;
            }

            // Odblokování tlačítka
            unblockBtn();

        }).fail(function () {
            // Odblokuje funkci po vzniku chyby
            unblockBtn();
        });
    }

    $btn.click(function () {
        getBooks();
    });

    getBooks();
});