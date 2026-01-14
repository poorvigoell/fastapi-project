from fastapi import FastAPI
from fastapi.params import Body

app = FastAPI()

BOOKS = [
    {'title': 'Book One', 'author': 'Author 1', 'category': 'Fiction'},
    {'title': 'Book Two', 'author': 'Author 2', 'category': 'History'},
    {'title': 'Book Three', 'author': 'Author 3', 'category': 'Science Fiction'},
    {'title': 'Book Four', 'author': 'Author 4', 'category': 'Fantasy'},
    {'title': 'Book Five', 'author': 'Author 5', 'category': 'Fiction'},
    {'title': 'Book Six', 'author': 'Author 2', 'category': 'History'},
]

@app.get("/books")
async def read_all_books():
    return BOOKS

@app.get("/books/mybook")
async def read_all_books():
    return {'book_title': 'My Favourite Book'}

@app.get("/books/{book_title}")
async def read_book(book_title: str):
    for book in BOOKS:
        if book.get('title').casefold() == book_title.casefold():
            return book

# fast api looks at functions in chronological order
# %20 is space encoding in url

@app.get("/books/")
async def read_category_by_query(category: str):
    books_to_return = []
    for book in BOOKS:
        if book.get('category').casefold() == category.casefold():
            books_to_return.append(book)
    return books_to_return

@app.get("/books/{book_author}/")
async def read_author_category_by_query(book_author: str, category: str):
    books_to_return = []
    for book in BOOKS:
        if (book.get('author').casefold() == book_author.casefold() and
                book.get('category').casefold() == category.casefold()):
            books_to_return.append(book)
    return books_to_return


# post request- to add new book
@app.post("/books/create_book")
async def create_book(new_book=Body()):
    BOOKS.append(new_book)


# put request- to update existing book
@app.put("/books/update_book")
async def update_book(updated_book=Body()):
    for i in range(len(BOOKS)):
        if BOOKS[i].get('title').casefold() == updated_book.get('title').casefold():
            BOOKS[i] = updated_book


# delete request- to delete existing book
@app.delete("/books/delete_book/{book_title}")
async def delete_book(book_title: str):
    for i in range(len(BOOKS)):
        if BOOKS[i].get('title').casefold() == book_title.casefold():
            BOOKS.pop(i)
            break

@app.get("/books/author/{book_author}")
async def read_books_by_author(book_author: str):
    books_to_return = []
    for book in BOOKS:
        if book.get('author').casefold() == book_author.casefold():
            books_to_return.append(book)
    return books_to_return