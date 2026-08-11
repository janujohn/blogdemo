# blogdemo

A simple blog app: Node.js + Express, SQLite storage (via the built-in
`node:sqlite` module), EJS views. Includes an admin UI for creating and
editing posts (no auth — content is managed by driving a browser against
the running app).

## Run

```
docker build -t blogdemo .
docker run -p 3000:3000 blogdemo
```

Public site: `http://localhost:3000/`
Admin: `http://localhost:3000/admin`
