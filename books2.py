from fastapi import FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from starlette import status

app = FastAPI()

class Book:
    id: int
    title: str
    author: str
    description: str
    rating: int
    published_year: int

    def __init__(self, id, title, author, description, rating, published_year):
        self.id = id
        self.title = title
        self.author = author
        self.description = description
        self.rating = rating
        self.published_year = published_year


class BookRequest(BaseModel):
    id: Optional[int] = Field(description='ID is not needed on create', default=None)
    title: str = Field(min_length=3)
    author: str = Field(min_length=1)
    description: str
    rating: int = Field(gt=-1, lt=6)  # greater than 0 and less than 6
    published_year: int = Field(gt=1000, lt=2027)

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "The Hobbit",
                "author": "J.R.R. Tolkien",
                "description": "A fantasy novel about a hobbit's adventure.",
                "rating": 5,
                "published_year": 1937
            }
        }
    }


BOOKS = [
    Book(1, "The Great Gatsby", "F. Scott Fitzgerald", "A novel set in the Roaring Twenties.", 5, 1925),
    Book(2, "To Kill a Mockingbird", "Harper Lee", "A novel about racial injustice in the Deep South.", 5, 1960),
    Book(3, "1984", "George Orwell", "A dystopian novel about totalitarianism.", 4, 1948),
    Book(4, "Pride and Prejudice", "Jane Austen", "A classic romance novel.", 5, 1813),
    Book(5, "The Catcher in the Rye", "J.D. Salinger", "A novel about teenage rebellion.", 4, 1951),
    Book(6, "Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "The first book in the Harry Potter series.", 5, 1997)
]

@app.get("/books", status_code=status.HTTP_200_OK)
async def read_all_books():
    return BOOKS

@app.get("/books/{book_id}", status_code=status.HTTP_200_OK) # path parameter
async def read_book(book_id: int = Path(gt=0)):
    for book in BOOKS:
        if book.id == book_id:
            return book
    raise HTTPException(status_code=404, detail="Book not found")


@app.get("/books/", status_code=status.HTTP_200_OK) # query parameter
async def reads_books_by_rating(rating: int = Query(gt=-1, lt=6)):
    books_to_return = []
    for book in BOOKS:
        if book.rating == rating:
            books_to_return.append(book)
    return books_to_return

@app.get("/books/by_year/", status_code=status.HTTP_200_OK)
async def read_books_by_published_year(published_year: int):
    books_to_return = []
    for book in BOOKS:
        if book.published_year == published_year:
            books_to_return.append(book)
    return books_to_return

@app.post("/create_book", status_code=status.HTTP_201_CREATED)
async def create_book(book_request: BookRequest):
    new_book = Book(**book_request.dict()) # ** unpacks the dictionary into keyword arguments
    print(type(new_book))
    BOOKS.append(find_book_id(new_book))

# pydantic is a python library used for data validation and settings management using python type annotations.

def find_book_id(book : Book):
    book.id = 1 if len(BOOKS) == 0 else BOOKS[-1].id + 1

    # if len(BOOKS) > 0:
    #     book.id = BOOKS[-1].id + 1
    # else:
    #     book.id = 1

    return book


@app.put("/books/update_book", status_code=status.HTTP_204_NO_CONTENT)
async def update_book(book: BookRequest):
    book_changed=False
    for i in range(len(BOOKS)):
        if BOOKS[i].id == book.id:
            BOOKS[i] = book
            book_changed=True
    if not book_changed:
        raise HTTPException(status_code=404, detail="Book not found")

@app.delete("/books/delete_book", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int = Path(gt=0)):
    for i in range(len(BOOKS)):
        if BOOKS[i].id == book_id:
            BOOKS.pop(i)
            return {"message": "Book deleted successfully"}
    return {"error": "Book not found"}