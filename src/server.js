const express = require('express');
const nanoid = require('nanoid');
const app = express();
app.use(express.json());

const books = [];

app.get('/books', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { books },
  });
});

app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: { book },
    });
  }
});

app.post('/books', (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (!name) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    return;
  }

  if (readPage > pageCount) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return;
  }

  const id = nanoid.nanoid();
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(book);

  res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
});

app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    return;
  }

  if (!name) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    return;
  }

  if (readPage > pageCount) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return;
  }

  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount;

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});

app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    return;
  }

  books.splice(bookIndex, 1);

  res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
