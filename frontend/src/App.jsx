import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publisher: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get(API);
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, {
        ...form,
        isbn: Date.now(),
        publicationYear: 2024,
        totalCopies: 1,
        availableCopies: 1,
        shelfLocation: "A1",
        bookType: "Circulating",
      });
    }

    setForm({ title: "", author: "", genre: "", publisher: "" });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchBooks();
  };

  const editBook = (book) => {
    setForm(book);
    setEditingId(book._id);
  };

  return (
    <div className="container">
      <h1>📚 Library Management Dashboard</h1>

      <form onSubmit={handleSubmit} className="form">
        <input name="title" placeholder="Book Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
        <input name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} required />

        <button type="submit">
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div className="book-list">
        {books.map((book) => (
          <div className="card" key={book._id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Publisher: {book.publisher}</p>

            <div className="buttons">
              <button onClick={() => editBook(book)} className="edit">
                Edit
              </button>
              <button onClick={() => deleteBook(book._id)} className="delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;