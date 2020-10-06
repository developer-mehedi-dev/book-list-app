// Book Class: Represent a Book
class Books {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks()

        books.forEach(book => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static bookDelete(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const alertDiv = document.createElement('div')
        alertDiv.className = `alert alert-${className}`
        alertDiv.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(alertDiv, form)

        // Vaning after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static addBook(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static deleteBook(isbn) {
        const books = Store.getBooks()
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks())

// Event: Add a Book
const book_form = document.querySelector('#book-form')

book_form.addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault()

    // Get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Pleas fill in all fields', 'danger')
    } else {
        // Instantiate book
        const book = new Books(title, author, isbn)

        // Add Book to UI
        UI.addBookToList(book)

        // Add book to store
        Store.addBook(book)

        // Show success message
        UI.showAlert('Book Added', 'success')

        // Clear field
        book_form.reset()
    }

})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book form UI
    UI.bookDelete(e.target)

    // Remove book from Store
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent)

    // Show delete message
    UI.showAlert('Book Deleted', 'danger')
})