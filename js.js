let library = [];
let borrowedBooks = []; 

// Construire un livre
function Book(title, author, publicationYear) {
  this.title = title;
  this.author = author;
  this.publicationYear = publicationYear;
  this.borrowed = false;
  this.borrowDate = null;
}

// Ajouter un livre à la bibliothèque
function addBook(book) {
  library.push(book);
  displayBooks();
}

// Lister les livres disponibles
function listBooks() {
  return library.filter(book => !book.borrowed);
}

// Afficher les livres dans le DOM
function displayBooks() {
  const availableBooksElement = document.getElementById('book-list');
  availableBooksElement.innerHTML = '';

  listBooks().forEach(book => {
    const bookItem = document.createElement('li');
    bookItem.setAttribute('data-title', book.title); 
    bookItem.innerHTML = `
    <strong>${book.title}</strong><br>
    Par ${book.author} (${book.publicationYear})
    <button onclick="borrowBook('${book.title}')">Emprunter</button>
    `;
    availableBooksElement.appendChild(bookItem);
  });

  const borrowedBooksElement = document.getElementById('borrowed-list');
  borrowedBooksElement.innerHTML = '';

  borrowedBooks.forEach(book => {
    const bookItem = document.createElement('li');
    bookItem.innerHTML = `
    <strong>${book.title}</strong><br>
    Par ${book.author} (${book.publicationYear})<br>
    Emprunté le : ${book.borrowDate}
    <button onclick="returnBook('${book.title}')">Retourner</button>
    `;
    borrowedBooksElement.appendChild(bookItem);
  });
}

// Emprunter un livre
function borrowBook(title) {
  const book = library.find(book => book.title === title);
  if (book && !book.borrowed) {
    book.borrowed = true;
    book.borrowDate = new Date().toLocaleDateString(); 
    borrowedBooks.push(book);
    displayBooks();
  } else {
    alert(`Le livre "${title}" est déjà emprunté ou introuvable.`);
  }
}

// Retourner un livre
function returnBook(title) {
  const bookIndex = borrowedBooks.findIndex(book => book.title === title);
  if (bookIndex !== -1) {
    const returnedBook = borrowedBooks.splice(bookIndex, 1)[0]; 
    returnedBook.borrowed = false;
    returnedBook.borrowDate = null;

    if (!library.some(book => book.title === returnedBook.title)) {
      library.push(returnedBook); 
    }

    displayBooks(); 
  }
}

// Fonction pour rechercher un livre par titre, auteur ou année
function findBookByQuery(titleQuery, authorQuery, yearQuery) {
  const lowerTitleQuery = titleQuery.toLowerCase();
  const lowerAuthorQuery = authorQuery.toLowerCase();
  const lowerYearQuery = yearQuery.toLowerCase();

  const books = library.filter(book =>
    book.title.includes(titleQuery) &&  
    book.author.includes(authorQuery) && 
    book.publicationYear.toString().includes(yearQuery)
    );

  if (books.length > 0) {
    books.forEach(book => highlightBook(book.title));
    return books; 
  } else {
    alert('Aucun livre trouvé pour cette recherche.');
    return [];
  }
}

// Mettre en surbrillance le livre et le faire défiler vers la vue
function highlightBook(title) {
  const bookElement = document.querySelector(`#book-list li[data-title="${title}"]`);

  if (bookElement) {
    bookElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bookElement.classList.add('highlight');
    setTimeout(() => {
      bookElement.classList.remove('highlight');
    }, 2000); 
  }
}

document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const titleQuery = document.getElementById('search-title').value;  
  const authorQuery = document.getElementById('search-author').value;
  const yearQuery = document.getElementById('search-year').value; 

  if (titleQuery || authorQuery || yearQuery) {
    const foundBooks = findBookByQuery(titleQuery, authorQuery, yearQuery);
    if (foundBooks.length > 0) {
      console.log(`Livres trouvés : ${foundBooks.length}`);
    }
  }
});

// Ajouter un livre via le formulaire
document.getElementById('book-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const publicationYear = document.getElementById('year').value; 
  const newBook = new Book(title, author, publicationYear);
  addBook(newBook);

  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('year').value = '';
});

displayBooks();
