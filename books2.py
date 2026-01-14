from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI()

class Book:
    id: int
    title: str
    author: str
    description: str
    rating: int

    def __init__(self, id, title, author, description, rating):
        self.id = id
        self.title = title
        self.author = author
        self.description = description
        self.rating = rating


class BookRequest(BaseModel):
    id: Optional[int] = None
    title: str = Field(min_length=3)
    author: str = Field(min_length=1)
    description: str
    rating: int = Field(gt=1, lt=6)  # greater than 0 and less than 6


BOOKS = [
    Book(1, "The Great Gatsby", "F. Scott Fitzgerald", "A novel set in the Roaring Twenties.", 5),
    Book(2, "To Kill a Mockingbird", "Harper Lee", "A novel about racial injustice in the Deep South.", 5),
    Book(3, "1984", "George Orwell", "A dystopian novel about totalitarianism.", 4),
    Book(4, "Pride and Prejudice", "Jane Austen", "A classic romance novel.", 5),
    Book(5, "The Catcher in the Rye", "J.D. Salinger", "A novel about teenage rebellion.", 4),
    Book(6, "Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "The first book in the Harry Potter series.", 5)
]

@app.get("/books")
async def read_all_books():
    return BOOKS

@app.post("/create_book")
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

