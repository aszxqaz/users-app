# API-сервис пользователей

## Предзарегистрированные пользователи:

### Админ:

Email: **admin@usersapp.ru**
Password: **password**

### Рядовой пользователь:

Email: **user@usersapp.ru**
Password: **password**

## Деплой

[https://users-app.up.railway.app/docs](https://users-app.up.railway.app/docs)

## Поднять локально
```bash
git clone https://github.com/aszxqaz/users-app
cd users-app
docker compose up
npm i
npx prisma generate
DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable" npx prisma db push
PORT=4000 DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable" JWT_SECRET=secret npm run dev
```

## Скриншот

![Screenshot](screenshot.jpg)