import pytest

def test_equal_or_not_equal():
    assert 1 == 1
    assert 1 != 2

def test_is_instance():
    assert isinstance("hello", str)
    assert not isinstance('123', int)

def test_boolean():
    validated = True
    assert validated is True
    assert ('hello' == 'world') is False

def test_type():
    assert type(123) is int
    assert type(123.45) is not int

class Student:
    def __init__(self, first_name: str, last_name: str, major: str, years: int):
        self.first_name = first_name
        self.last_name = last_name
        self.major = major
        self.years = years

@pytest.fixture
def default_employee():
    return Student("John", "Doe", "Computer Science", 3)

def test_person_initialization(default_employee):
    assert default_employee.first_name == "John", "First name should be John"
    assert default_employee.last_name == "Doe", "Last name should be Doe"
    assert default_employee.major == "Computer Science", "Major should be Computer Science"
    assert default_employee.years == 3