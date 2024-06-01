document.addEventListener("DOMContentLoaded", function () {
  let bookshelf = {
    incomplete: [],
    complete: [],
  };

  //menyimpan data buku ke local storage
  function saveBookshelf() {
    localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
  }

  // generate ID
  function generateUniqueID() {
    return "book-" + new Date().getTime();
  }

  // menambahkan buku
  function addBookToShelf(title, author, year, isComplete) {
    const book = {
      id: generateUniqueID(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    if (isComplete) {
      bookshelf.complete.push(book);
    } else {
      bookshelf.incomplete.push(book);
    }

    saveBookshelf();
    renderBookshelf();

    // Menampilkan pemberitahuan
    alert(`Buku "${book.title}" berhasil ditambahkan`);
  }

  // memindahkan buku dari rak satu ke rak lain
  function moveBook(id, isComplete) {
    const shelf = isComplete ? bookshelf.complete : bookshelf.incomplete;
    const index = shelf.findIndex((book) => book.id === id);
    if (index !== -1) {
      const bookToMove = shelf[index];
      if (isComplete) {
        bookshelf.complete.splice(index, 1);
        bookshelf.incomplete.push(bookToMove);
      } else {
        bookshelf.incomplete.splice(index, 1);
        bookshelf.complete.push(bookToMove);
      }
      saveBookshelf();
      renderBookshelf();
    }
  }

  // menghapus buku dari rak
  function removeBookFromShelf(id, isComplete) {
    if (
      confirm(
        "Anda ingin mengahapus buku \nApakah Anda sungguh-sungguh yakin ingin menghapus buku ini?"
      )
    ) {
      const shelf = isComplete ? bookshelf.complete : bookshelf.incomplete;
      const index = shelf.findIndex((book) => book.id === id);
      if (index !== -1) {
        shelf.splice(index, 1);
        saveBookshelf();
        renderBookshelf();
      }
    }
  }

  // memuat ulang daftar buku
  function renderBookshelf() {
    const incompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    bookshelf.incomplete.forEach((book, index) => {
      const bookItem = createBookItem(book, book.id, false);
      incompleteBookshelfList.appendChild(bookItem);
    });

    bookshelf.complete.forEach((book, index) => {
      const bookItem = createBookItem(book, book.id, true);
      completeBookshelfList.appendChild(bookItem);
    });
  }

  // membuat elemen buku
  function createBookItem(book, id, isComplete) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const titleElement = document.createElement("h3");
    titleElement.innerText = book.title;

    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis: ${book.author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun: ${book.year}`;

    const actionElement = document.createElement("div");
    actionElement.classList.add("action");

    if (isComplete) {
      const uncompleteButton = createActionButton(
        "green",
        "Belum selesai di Baca",
        id,
        true
      );
      actionElement.appendChild(uncompleteButton);
    } else {
      const completeButton = createActionButton(
        "green",
        "Selesai dibaca",
        id,
        false
      );
      actionElement.appendChild(completeButton);
    }

    const deleteButton = createActionButton(
      "red",
      "Hapus buku",
      id,
      isComplete
    );
    actionElement.appendChild(deleteButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(actionElement);

    return bookItem;
  }

  // membuat aksi pada tombol
  function createActionButton(className, text, id, isComplete) {
    const button = document.createElement("button");
    button.classList.add(className);
    button.innerText = text;

    button.addEventListener("click", function () {
      if (text === "Hapus buku") {
        removeBookFromShelf(id, isComplete);
      } else if (isComplete) {
        moveBook(id, true);
      } else {
        moveBook(id, false);
      }

      renderBookshelf();
    });

    return button;
  }

  const bookSubmitButton = document.getElementById("bookSubmit");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  inputBookIsComplete.addEventListener("change", function () {
    if (inputBookIsComplete.checked) {
      bookSubmitButton.innerText = "Masukkan Buku ke rak Selesai dibaca";
    } else {
      bookSubmitButton.innerText = "Masukkan Buku ke rak Belum selesai dibaca";
    }
  });

  // menangani penyerahan buku
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("Title").value;
    const author = document.getElementById("Author").value;
    const year = document.getElementById("Year").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    addBookToShelf(title, author, year, isComplete);

    document.getElementById("Title").value = "";
    document.getElementById("Author").value = "";
    document.getElementById("Year").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
    bookSubmitButton.innerText = "Masukkan Buku ke rak Belum selesai dibaca";
  });

  // mencari buku
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTitle = document.getElementById("searchBookTitle").value;

    const searchResult = bookshelf.incomplete
      .concat(bookshelf.complete)
      .filter((book) => {
        return book.title.toLowerCase().includes(searchTitle.toLowerCase());
      });

    const incompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    searchResult.forEach((book, index) => {
      if (book.isComplete) {
        const bookItem = createBookItem(book, book.id, true);
        completeBookshelfList.appendChild(bookItem);
      } else {
        const bookItem = createBookItem(book, book.id, false);
        incompleteBookshelfList.appendChild(bookItem);
      }
    });
  });

  // memuat data buku dari local storage saat halaman dimuat
  const storedBookshelf = localStorage.getItem("bookshelf");
  if (storedBookshelf) {
    bookshelf = JSON.parse(storedBookshelf);
    renderBookshelf();
  }
});
