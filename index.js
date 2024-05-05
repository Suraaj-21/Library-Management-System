class BookData {
    constructor(isbn) {
        this.borrowedStatus = false;
        this.borrowedByUserId = null;
        this.isbn = isbn;
        this.publisher = 'Default Publisher';
        this.author = 'Default Author';
        this.dateOfReturn = new Date();
    }

    setReturnDate() {
        let returnDate = new Date(this.dateOfReturn.getTime());
        returnDate.setMonth(returnDate.getMonth() + 1);
        this.dateOfReturn = returnDate;
    }
}

class LibraryStorage {
    constructor() {
        this.storage = new Map();
        this.requestQueue = [];
        this.pendingRequests = [];
        for (let i = 100001; i <= 100010; i++) {
            this.storage.set(i, new BookData(i));
        }
    }

    addRequest(isbn, userId) {
        this.requestQueue.push({ isbn, userId });
        
        this.updateOutput();
    }

    processQueue() {
        while (this.requestQueue.length > 0) {
            let { isbn, userId } = this.requestQueue.shift();
            let book = this.storage.get(isbn);
            if (!book) {
                this.pendingRequests.push({ isbn, userId });
                continue;
            }

            if (book.borrowedStatus===false) {
                book.borrowedStatus = true;
                book.borrowedByUserId = userId;
                book.setReturnDate();
            } else {
                this.pendingRequests.push({ isbn, userId });
            }
        }
        this.updateOutput();
    }

    updateOutput() {
        const output = document.getElementById('outputLog');
        output.innerHTML = `<p>Current Queue: ${JSON.stringify(this.requestQueue)}</p>
                            <p>Pending Requests: ${JSON.stringify(this.pendingRequests)}</p>`;
    }
}

const library = new LibraryStorage();

function handleFormSubmit(event) {
    event.preventDefault();
    const isbn = parseInt(document.getElementById('isbn').value, 10);  // Convert input to integer
    const userId = parseInt(document.getElementById('userId').value, 10);  // Convert input to integer
    library.addRequest(isbn, userId);
}
function processRequests() {
    library.processQueue();
}
