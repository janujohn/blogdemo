# Blog Demo

A simple blog app: Node.js + Express backend, SQLite storage, EJS views,
and a server-rendered admin UI (no login) for creating and editing posts.

## Run with Docker

```
docker build -t blogdemo .
docker run --rm -p 3000:3000 -v blogdemo-data:/app/data blogdemo
```

Then open http://localhost:3000 for the public site, or
http://localhost:3000/admin to create and edit posts.
