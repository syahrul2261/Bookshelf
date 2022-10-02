document.addEventListener('DOMContentLoaded', function () { 
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        bookLength();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const generatedID = generateId();
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookYear = document.getElementById('year').value;
    const cb = document.querySelector("#isCompleted");
    const bookIsCompleted =cb.checked;

    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

const books = [];
const RENDER_EVENT = 'render-book'

document.addEventListener(RENDER_EVENT, function () {
    const unCompletedBOOKList = document.getElementById('unCompletedBook');
    unCompletedBOOKList.innerHTML = '';

    const CompletedBOOKList = document.getElementById('completedBook');
    CompletedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            unCompletedBOOKList.append(bookElement);
        } else {
            CompletedBOOKList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const divButton = document.createElement("div");
    divButton.classList.add("row");

    const textTitle = document.createElement('h2');
    textTitle.innerHTML = bookObject.title;

    const textAuthor = document.createElement('p')
    textAuthor.innerHTML = bookObject.author;

    const textYear = document.createElement('p')
    textYear.innerHTML = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('card', 'card-body', 'border-dark');
    textContainer.append(textTitle, textAuthor, textYear, divButton);
    textContainer.setAttribute("id", 'content');

    const container = document.createElement('div');
    container.classList.add('col-12', 'col-lg-6', 'mb-3');
    container.append(textContainer);
    container.setAttribute('id', `${bookObject.id}`);

    if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("btn", "col-5", 'mx-auto', 'btn-primary');
    undoButton.innerText = 'Undo';

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });
        
    const trashButton = document.createElement("button");
    trashButton.classList.add("btn", "col-5", 'mx-auto', 'btn-danger');
    trashButton.innerText = 'Hapus';

    trashButton.addEventListener("click", function () {
      if (confirm("Apakah Kamu yakin untuk menghapus buku ini dari list?")) {
        removeTaskFromCompleted(bookObject.id);
      } else {
        return false;
      }
    });
        
     divButton.append( undoButton, trashButton)
    } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add("btn", "col-5", 'mx-auto', "btn-primary");
        checkButton.innerText = 'Check';

    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });
    
    const trashButton = document.createElement("button");
    trashButton.classList.add("btn", "col-5", 'mx-auto', "btn-danger");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener("click", function () {
        if (confirm('Apakah Kamu yakin untuk menghapus buku ini dari list?')) {
            removeTaskFromCompleted(bookObject.id);
      } else {
            return false;
      }
    });

    divButton.append(checkButton, trashButton);
  }

  return container;
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    bookLength();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'bookshelf';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser Kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}


const search = document.getElementById("search");
const search1 = document.getElementById("search1");
let hpCharacter = [];

search1.addEventListener('keyup', () => {
    const searchString = search1.value;
    console.log(searchString);
    for (i = 0; i < books.length; i++){
        const textTitle = books[i].title;
        const textAuthor = books[i].author;
        if (
          textTitle.includes(searchString) ||
          textAuthor.includes(searchString)
        ) {
          document.getElementById(books[i].id).style.display = "flex";
        } else {
            document.getElementById(books[i].id).style.display = "none";
        }
    }
});

search.addEventListener('keyup', () => {
    const searchString = search.value;
    console.log(searchString);
    for (i = 0; i < books.length; i++){
        const textTitle = books[i].title;
        const textAuthor = books[i].author;
        if (
          textTitle.includes(searchString) ||
          textAuthor.includes(searchString)
        ) {
          document.getElementById(books[i].id).style.display = "flex";
        } else {
          document.getElementById(books[i].id).style.display = "none";
        }
    }
});


const modal = document.getElementById('modal');
const modall = document.getElementById('modal-content');
const tambah = document.getElementById('tambahBuku');
const tambah2 = document.getElementById('tambahBuku2');
const closeModal = document.getElementById('modal-close');

tambah.addEventListener('click', function () {
    modal.classList.remove("d-none");
});

tambah2.addEventListener('click', function () {
    modal.classList.remove("d-none");
});

closeModal.addEventListener('click', function () {
    modal.classList.add("d-none");
});


window.onclick = function (event) {
  if (event.target == modall) {
    modal.style.display = "none";
  }
};


function bookLength() {
    document.getElementById("totalBuku").innerText = books.length + " Buku";
}


window.onload = function() {
    bookLength();
};

const hapusSemua = document.getElementById('hapusSemua');
hapusSemua.addEventListener('click', function () {
    deleteAll();
});

function deleteAll() {
        if (confirm("apakah anda yakin menghapus semua data?")) {
          localStorage.clear();
            bookLength();
            window.location.reload();
        } else {
          return false;
        }
}