/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      list: '.books-list',
      image: '.book__image',
    },
    form: {
      filters: '.filters',
    },
    attribute: {
      classFavorite: 'favorite',
      classBookImage: 'book__image',
      dataId: 'data-id',
    },
  };


  const template = {
    bookAdder: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {

    constructor() {
      const thisBooksList = this;

      thisBooksList.favouriteBooks = [];
      thisBooksList.filters = [];

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    initData() {
      this.data = dataSource.books;
    }

    getElements () {
      const thisBooksList = this;

      thisBooksList.dom = {};
      thisBooksList.dom.list = document.querySelector(select.containerOf.list);
      thisBooksList.dom.filters = document.querySelector(select.form.filters);
    }

    render() {
      const thisBooksList = this;

      for(let book of thisBooksList.data) {

        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);

        book.ratingWidth = book.rating * 10;

        const generatedHTML = template.bookAdder(book);

        const generatedDOM = utils.createDOMFromHTML(generatedHTML);

        const menuContainer = thisBooksList.dom.list;

        menuContainer.appendChild(generatedDOM);
      }
    }

    initActions() {
      const thisBooksList = this;

      thisBooksList.dom.list.addEventListener('dblclick', function (event) {
        event.preventDefault();

        const bookImage = event.target.offsetParent;

        if (bookImage.classList.contains(select.attribute.classBookImage)) {
        
          const bookId = bookImage.getAttribute(select.attribute.dataId);
          const indexOfBook = thisBooksList.favouriteBooks.indexOf(bookId);

          if (thisBooksList.favouriteBooks[indexOfBook]) {
            bookImage.classList.remove(select.attribute.classFavorite);
            thisBooksList.favouriteBooks.splice(indexOfBook, 1);

          } else {
            bookImage.classList.add(select.attribute.classFavorite);
            thisBooksList.favouriteBooks.push(bookId);
          }
        }  
      });

      thisBooksList.dom.filters.addEventListener('click', function (event) {

        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          const filterValue = event.target.value;

          if (event.target.checked) {
            thisBooksList.filters.push(filterValue); 

          } else {
            const indexOfFilter = thisBooksList.filters.indexOf(filterValue);
            thisBooksList.filters.splice(indexOfFilter, 1);
          }
        }

        thisBooksList.filterBooks(thisBooksList.data);
      });
    }

    filterBooks(books) {
    
      for (const book of books) {
        let shouldBeHidden = false;
      
        for (const filter of this.filters) {

          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          } 
        }

        const bookImage = document.querySelector(`[data-id="${book.id}"]`);

        if (shouldBeHidden) {
          bookImage.classList.add('hidden');

        } else {
          bookImage.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {

      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)'; 

      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';

      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';

      } else if (rating > 9) {
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }

  const app = new BooksList();
}