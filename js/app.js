$(document).ready(function() {

    var $btn = $(".morebooks");
    var body = $("body");
    var indexBook = 1;
    var block = false;
    var recall = false;
    var windowHeight = $(window).height();
    var bodyHeight = body.height();
    var searchWord = "javascript";
    var publisher = "";

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

        $.getJSON("https://www.googleapis.com/books/v1/volumes?q=" + searchWord + "&key=AIzaSyAXdxLtzZneUFXbWDt_TjbJMKhEIdGcYcQ&maxResults=" + count + "&startIndex=" + index, function(response) {
            var volumeInfo, item, clearfix, bookTitle, bookDescFull, bookDesc, bookImg, bookPublisher;
            var responseItemCount = 0;
            var booksInfo = document.getElementById("books-template").innerHTML;
            var template = Handlebars.compile(booksInfo);
            var bookItems = [];

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
                bookTitle = (volumeInfo.title ? volumeInfo.title : "No title");
                bookDescFull = (volumeInfo.description ? volumeInfo.description : "No description");
                bookDesc = bookDescFull.substring(0, 150);
                bookDesc = bookDesc + "...";
                bookImg = (volumeInfo.imageLinks ? ("<img src='" + volumeInfo.imageLinks.thumbnail + "'>") : "No thumbnail");
                bookPublisher = (volumeInfo.publisher ? volumeInfo.publisher : "No publisher");
                if (indexBook  % 2 == 0) {
                    clearfix = true;
                } else {
                    clearfix = false;
                }
                if (publisher != "") {
                    var bookPublisherSmall = bookPublisher.toLowerCase();
                    var publisherSmall = publisher.toLowerCase();
                    var publisherMath = bookPublisherSmall.indexOf(publisherSmall); 
                    if (publisherMath >= 0) {
                        bookItems.push({
                            title: bookTitle,
                            description: bookDesc,
                            img: bookImg,
                            publisher: bookPublisher,
                            clearfix: clearfix
                        });
                        indexBook++;
                    }
                } else {
                    bookItems.push({
                        title: bookTitle,
                        description: bookDesc,
                        img: bookImg,
                        publisher: bookPublisher,
                        clearfix: clearfix
                    });
                    indexBook++;
                }

            }
            console.log(bookItems);
            var booksData = template({
                booksItem: bookItems
            });
            document.getElementById('books').innerHTML += booksData;

            // Pokud neodpovídá počet záznamů (chyba v google books API), načteme chybějící zbytek
            if (responseItemCount < originalCount) {
                console.log("Error in loading, try to catch all 10 items..");
                recall = true;
                getBooks(originalCount - responseItemCount, index + originalCount);
                return;
            }

            // Odblokování tlačítka
            unblockBtn();

        }).fail(function() {
            // Odblokuje funkci po vzniku chyby
            unblockBtn();
        });
    }

    $btn.click(function() {
        getBooks();
    });

    $("#search-form").submit(function(event) {
        var $inputs = $('#search-form :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });
        searchWord = values["bookName"];
        publisher = values["bookPublisher"];
        $("#books").empty();
        getBooks();
        event.preventDefault();
    });
    $(window).scroll(function() {
        var pos = body.scrollTop() + windowHeight;
        var offset = $btn.offset();
        var toBottom = pos - bodyHeight;
        if ((offset.top - toBottom) < 500) {
            getBooks();
        }
    });
    getBooks();
});