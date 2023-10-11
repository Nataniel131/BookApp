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
      const thisBookList = this;

      thisBookList.favouriteBooks = [];
      thisBookList.filters = [];

      thisBookList.initData();
      thisBookList.getElements();
      thisBookList.render();
      thisBookList.initActions();

    }

    initData() {
      this.data = dataSource.books;
    }

    getElements () {
      const thisBookList = this;

      thisBookList.dom = {};
      thisBookList.dom.list = document.querySelector(select.containerOf.list);
      thisBookList.dom.filters = document.querySelector(select.form.filters);
    }

    render() {
      const thisBookList = this;

      for(let book of thisBookList.data) {

        book.ratingBgc = thisBookList.determineRatingBgc(book.rating);

        book.ratingWidth = book.rating * 10;

        const generatedHTML = template.bookAdder(book);

        const generatedDOM = utils.createDOMFromHTML(generatedHTML);

        const menuContainer = thisBookList.dom.list;

        menuContainer.appendChild(generatedDOM);
      }
    }

    initActions() {
      const thisBookList = this;

      thisBookList.dom.list.addEventListener('dblclick', function (event) {
        event.preventDefault();

        const bookImage = event.target.offsetParent;

        if (bookImage.classList.contains(select.attribute.classBookImage)) {
        
          const bookId = bookImage.getAttribute(select.attribute.dataId);
          const indexOfBook = thisBookList.favouriteBooks.indexOf(bookId);

          if (thisBookList.favouriteBooks[indexOfBook]) {
            bookImage.classList.remove(select.attribute.classFavorite);
            thisBookList.favouriteBooks.splice(indexOfBook, 1);

          } else {
            bookImage.classList.add(select.attribute.classFavorite);
            thisBookList.favouriteBooks.push(bookId);
          }
        }  
      });

      thisBookList.dom.filters.addEventListener('click', function (event) {

        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          const filterValue = event.target.value;

          if (event.target.checked) {
            thisBookList.filters.push(filterValue); 

          } else {
            const indexOfFilter = thisBookList.filters.indexOf(filterValue);
            thisBookList.filters.splice(indexOfFilter, 1);
          }
        }

        thisBookList.filterBooks(thisBookList.data);
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