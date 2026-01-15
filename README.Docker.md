# Docker Setup

This project includes Docker Compose configuration for running the Movie API with MySQL database.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Build and start the services:**
   ```bash
   docker-compose up -d
   ```

2. **Check the logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Access the API:**
   - API: http://localhost:3000
   - MySQL: localhost:3306

## Docker Compose Services

### App Service
- Container: `movie-api`
- Port: `3000:3000`
- Depends on MySQL being healthy

### MySQL Service
- Container: `movie-mysql`
- Port: `3306:3306`
- Database: `movie_db`
- User: `movie_user`
- Password: `movie_password`
- Root Password: `root_password`

## Available Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (deletes database data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

### Rebuild services
```bash
docker-compose up -d --build
```

### Access MySQL CLI
```bash
docker-compose exec mysql mysql -u movie_user -pmovie_password movie_db
```

### Access app container
```bash
docker-compose exec app sh
```

## Database Initialization

The MySQL database is automatically initialized with a schema on first run using the SQL file located in `init-db/01-schema.sql`. This includes:
- Movies table creation
- Sample data insertion
- Indexes for performance

## Environment Variables

The docker-compose.yml file includes predefined environment variables. For production, create a `.env` file based on `.env.example` and update the credentials:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=movie_user
DB_PASSWORD=your_secure_password
DB_NAME=movie_db
```

## Persistent Data

MySQL data is persisted using Docker volumes (`mysql-data`). Data will remain even after stopping containers unless you use `docker-compose down -v`.

## Troubleshooting

### MySQL not ready
If the app fails to connect to MySQL, ensure the MySQL health check passes:
```bash
docker-compose ps
```

### Port conflicts
If port 3000 or 3306 is already in use, modify the ports in docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Change host port to 3001
```

### View container status
```bash
docker-compose ps
```

### Restart a specific service
```bash
docker-compose restart app
docker-compose restart mysql
```
