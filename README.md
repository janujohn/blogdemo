# Blog Demo

A simple blog app built with Node.js, Express, EJS, and SQLite.

## Features

- Public homepage listing all posts
- Individual post view pages
- Admin UI for creating, editing, and deleting posts (no login required)

## Running with Docker

```
docker build -t blogdemo .
docker run -p 3000:3000 blogdemo
```

The app will be available at `http://localhost:3000`. The admin UI is at
`http://localhost:3000/admin`.
