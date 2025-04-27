# Hey Sheldon

A sound detection and bark monitoring app, running on a lightweight Node.js backend and a blazing-fast Nginx frontend.

Sends a notification when 3 loud barks are detected within 60 seconds, based on the MAX_RMS_AMPLITUDE threshold.



---

## Project Structure

```bash
Hey-Sheldon/
├── client/              # Frontend (React app, built with Node, served via Nginx)
│   ├── build/           # Production-ready static files
│   ├── src/             # Source code
│   └── nginx.conf       # Nginx configuration for serving the frontend
├── server/              # Backend (Node.js sound detection server)
│   ├── server.js        # Main server logic
│   ├── config.json      # Configuration file
│   └── Dockerfile       # Backend Dockerfile
├── docker-compose.yml   # Multi-container orchestration
└── README.md            # Project documentation
```

---

## Setup

### Prerequisites

- Docker
- Docker Compose
- Node.js 16 for client development (material.ui dependency)
- Node.js 20+ for server development
- A USB microphone
- A Raspberry Pi (optional, but recommended for deployment)
- install sox, alasa-lib, alsa-utils (for sound detection)
-

## Startup

- On mac

```shell
  brew install sox
```

- On Linux

```shell
  apt-get install sox alsa-lib alsa-utils
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/hey-sheldon.git
cd hey-sheldon

# Build and run the full stack
docker-compose up --build

# Or run the deploy script
./deploy.sh
```

- Server available at: `http://localhost:5100`
- Frontend available at: `http://localhost:3000`

---

## How It Works

| Component    | Tech          | Description                                                |
|:-------------|:--------------|:-----------------------------------------------------------|
| **Frontend** | React + Nginx | Compiled into static files (`build/`) and served via Nginx |
| **Backend**  | Node.js       | Express-based API + sound detection logic                  |
| **Database** | SQLite        | Local persistent database (mounted via Docker volume)      |

---

## Build Process (Client)

The frontend (`client/`) uses a **multi-stage Docker build**:

1. **Node.js stage**: installs dependencies and builds the React app.
2. **Nginx stage**: copies the static build output into an Nginx image.

**Dockerfile excerpt:**

```Dockerfile
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Environment Variables

The backend server uses the following environment variables:

| Variable | Description                         |
|:---------|:------------------------------------|
| `TZ`     | Timezone for logging and scheduling |

---

## Development Tools

- **Frontend**:  
  For local development:

  ```bash
  cd client
  rm -rf node_modules
  npm cache clean --force
  npm install --legacy-peer-deps
  npm start
  ```

  Then visit `http://localhost:3000`.


- **Backend**:  
  For backend development:

  ```bash
  cd server
  rm -rf node_modules
  npm cache clean --force
  npm install
  npm start # or node server.js
  ````
  
  Then visit `http://localhost:5100`.

---

## Troubleshooting

- If you see `403 Forbidden` errors from Nginx:
    - Make sure the `build/` folder is **properly generated** (`npm run build`) before running Docker Compose.
    - Ensure correct permissions (`chmod -R 755 build`).
    - Validate that `nginx.conf` is correctly mapped and does **NOT** contain forbidden directives like `user nginx;`
      inside `conf.d/*.conf`.


- Always **rebuild** containers after making changes:

  ```bash
  docker-compose down
  docker-compose up --build
  ```

---

## Future Improvements

- [ ] Add SSL (Let's Encrypt) to production frontend.
- [ ] Implement backend authentication (JWT).
- [ ] Improve client-side error handling.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

# 🚀 Happy Bark Monitoring!