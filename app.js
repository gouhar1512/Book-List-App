//Book Class: Represent a book

 class Book {
   constructor(title, author, isbn) {
     this.title = title;
     this.author = author;
     this.isbn = isbn;
   }
 }
 
 //UI Class : Handles UI
 
 class UI {
   static displayBooks() {
     const StoredBooks = Store.getBooks();
     const books = StoredBooks;
     books.forEach(book => {
       UI.addBookToList(book);
     });
   }
 
   //Add book to list
   static addBookToList(book) {
     const list = document.getElementById("book-list");
     const row = document.createElement("tr");
     row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
       `;
     list.appendChild(row);
   }

   //Clearing fields
   static clearFields() {
     document.getElementById('title').value = ''
     document.getElementById('author').value = ''
     document.getElementById('isbn').value = ''
   }

   //Delete book from list
   static deleteBook(el) {
      if(el.classList.contains('delete')){
         el.parentElement.parentElement.remove();

         //Show delete message
         this.showAlert('Book Removed', 'success');
      }
   }

   //Showing alert message
   static showAlert(message, className){
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const alertBox = document.querySelector('#alertBox');
      alertBox.innerHTML = '';
      alertBox.appendChild(div);

      //Vanish in 3 seconds
      setTimeout(()=> { 
         const x = document.querySelector('.alert');
         if(x)
            x.remove(); 
      },3000);
   }

 }

 //Class Store :  Handles Local Storage
 
  class Store {
    static getBooks() {
      let allBooks;
      if(localStorage.getItem('books') === null) {
        allBooks = [];
      } else {
        allBooks = JSON.parse(localStorage.getItem('books'));
      }
      return allBooks;
    }

    static addBook(book) {
      const allBooks = Store.getBooks();
      allBooks.push(book);
      localStorage.setItem('books', JSON.stringify(allBooks));
    }

    static removeBook(isbn) {
      const allBooks = Store.getBooks();
      allBooks.forEach((book, index) => {
        if(book.isbn === isbn){
          allBooks.splice(index, 1);
        }
      });

      localStorage.setItem('books', JSON.stringify(allBooks));
    }

  }



 document.addEventListener('DOMContentLoaded', UI.displayBooks());
 
 //Event : Add Book
 document.getElementById('book-form').addEventListener('submit',(e)=>{
    //Prevent actual form submit
    e.preventDefault();

    //Get form
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //Validate Form
   if(title === '' || author==='' || isbn===''){
      UI.showAlert('Please fill in the fields', 'danger');
   } else{
      //Instantiate Book
      const book = new Book(title, author, isbn);

      //Add book to UI
      UI.addBookToList(book);

      //Add book to Store
      Store.addBook(book);

      //Show success message
      UI.showAlert('Book Added', 'success');
      
      //Clear Fields
      UI.clearFields();
   }
 });
 
 document.getElementById('book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
 });
