/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    listOf: {
      bookList: '.books-list',
      bookImage: '.book__image',
    },
    attribute: {
      classFavorite: 'favorite',
      dataId: 'data-id',
      classBookImage: 'book__image',
    },
  };

  const template = {
    bookAdder: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  const favouriteBooks = [];


  const render = function(books) {

    for(const book of books) {

      const generatedHTML = template.bookAdder(book);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      const menuContainer = document.querySelector(select.listOf.bookList);

      menuContainer.appendChild(generatedDOM);
    }
  };

  const initActions = function () {

    const booksList = document.querySelector(select.listOf.bookList);

    booksList.addEventListener('dblclick', function(event) {
      event.preventDefault();

      const bookImage = event.target.offsetParent;

      if (bookImage.classList.contains(select.attribute.classBookImage)) {
        
        const bookId = bookImage.getAttribute(select.attribute.dataId);
        const indexOfBook = favouriteBooks.indexOf(bookId);

        if(favouriteBooks[indexOfBook]) {
          bookImage.classList.remove(select.attribute.classFavorite);
          favouriteBooks.splice(indexOfBook, 1);

        } else {
          bookImage.classList.add(select.attribute.classFavorite);
          favouriteBooks.push(bookId);
        }
      }  
    });
  };

  render(dataSource.books);

  initActions();
}