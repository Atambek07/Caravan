# Караван — B2B платформа поставщика

![Python](https://img.shields.io/badge/Python-3.12+-blue)
![Django](https://img.shields.io/badge/Django-5+-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

**Караван** — production-ready B2B система для поставщика товаров. Поставщик управляет каталогом и заказами, розничные магазины регистрируются и оформляют заказы через веб-интерфейс.

## Возможности

- Ролевая модель: **Администратор**, **Менеджер товаров**, **Заказчик**
- JWT-аутентификация с refresh-токенами и blacklist при logout
- Каталог товаров с поиском, фильтрацией, сортировкой и пагинацией
- Корзина и оформление заказов с автоматическим списанием остатков
- Уведомления о новых заказах и смене статусов
- Дашборды с аналитикой и графиками
- Django Admin с расширенными фильтрами и массовыми действиями
- Swagger API документация
- Адаптивный UI с light/dark темой

## Стек технологий

| Backend | Frontend | Инфраструктура |
|---------|----------|----------------|
| Python 3.12+ | React 18 | Docker |
| Django 5+ | TypeScript | Docker Compose |
| DRF | Vite | Nginx |
| PostgreSQL | Material UI | |
| SimpleJWT | React Query | |
| drf-spectacular | Zustand | |

## Структура проекта

```
Caravan_cr/
├── backend/                 # Django API
│   ├── accounts/            # Пользователи, auth, RBAC
│   ├── stores/              # Магазины
│   ├── products/            # Товары и категории
│   ├── orders/              # Заказы
│   ├── dashboard/           # Статистика
│   ├── notifications/       # Уведомления
│   └── caravan/             # Настройки проекта
├── frontend/                # React SPA
│   └── src/
│       ├── pages/           # Страницы
│       ├── components/      # UI-компоненты
│       ├── layouts/         # Layouts
│       ├── services/        # API-клиенты
│       ├── store/           # Zustand stores
│       ├── hooks/           # React hooks
│       ├── types/           # TypeScript types
│       └── utils/           # Утилиты
├── nginx/                   # Reverse proxy
├── docker-compose.yml
├── README.md
└── PROJECT_GUIDE.md
```

## Быстрый старт (Docker)

```bash
# Клонировать репозиторий и перейти в каталог
cd Caravan_cr

# Скопировать переменные окружения (опционально)
cp .env.example .env

# Запустить все сервисы
docker-compose up --build
```

После запуска:

| Сервис | URL |
|--------|-----|
| Веб-интерфейс | http://localhost |
| Django Admin | http://localhost/admin/ |
| Swagger API | http://localhost/api/docs/ |

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `POSTGRES_DB` | Имя БД | `caravan` |
| `POSTGRES_USER` | Пользователь БД | `caravan` |
| `POSTGRES_PASSWORD` | Пароль БД | `caravan_secret` |
| `SECRET_KEY` | Django secret key | — |
| `DEBUG` | Режим отладки | `False` |
| `DJANGO_SUPERUSER_USERNAME` | Логин admin | `admin` |
| `DJANGO_SUPERUSER_PASSWORD` | Пароль admin | `admin12345` |
| `JWT_ACCESS_LIFETIME` | JWT access (мин) | `60` |
| `JWT_REFRESH_LIFETIME` | JWT refresh (мин) | `10080` |
| `FRONTEND_URL` | URL сайта (ссылки в письмах) | `http://localhost` |
| `EMAIL_HOST` | SMTP-сервер | — (консоль) |
| `EMAIL_HOST_USER` | Логин SMTP | — |
| `EMAIL_HOST_PASSWORD` | Пароль SMTP | — |
| `NOTIFY_EMAIL` | Email при заказах | `True` |
| `NOTIFY_SMS` | SMS при заказах | `False` |
| `SMS_ENABLED` | Включить SMS | `False` |

## Восстановление пароля

1. Пользователь открывает `/password-reset` и вводит email.
2. На почту приходит ссылка вида `/password-reset/confirm?uid=...&token=...`.
3. Пользователь задаёт новый пароль.

API:
- `POST /api/auth/password-reset/` — `{ "email": "..." }`
- `POST /api/auth/password-reset/confirm/` — `{ "uid", "token", "password", "password_confirm" }`

Без настройки SMTP письма выводятся в лог backend: `docker compose logs backend`.

## Email и SMS уведомления

| Событие | In-app | Email | SMS |
|---------|--------|-------|-----|
| Новый заказ | Админ | Админ | Админ (если телефон) |
| Смена статуса | Заказчик | Заказчик | Заказчик (если телефон) |

Настройка SMTP в `.env` — см. `.env.example`. SMS через HTTP API (`SMS_PROVIDER=http`).


## Создание администратора

При первом запуске контейнера `backend` автоматически создаётся суперпользователь из переменных окружения.

**Учётные данные по умолчанию:**
- Логин: `admin`
- Пароль: `admin12345`

Вручную:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Использование API

### Регистрация магазина

```bash
curl -X POST http://localhost/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shop1",
    "email": "shop1@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "store_name": "Магазин №1",
    "store_address": "г. Алматы, ул. Примерная 1"
  }'
```

### Авторизация

```bash
curl -X POST http://localhost/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin12345"}'
```

### Запрос с JWT

```bash
curl http://localhost/api/products/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Swagger

- OpenAPI schema: http://localhost/api/schema/
- Swagger UI: http://localhost/api/docs/

## Скриншоты

<!-- Добавьте скриншоты после запуска -->

| Главная | Дашборд администратора |
|---------|------------------------|
| _screenshots/home.png_ | _screenshots/admin-dashboard.png_ |

| Каталог | Django Admin |
|---------|--------------|
| _screenshots/catalog.png_ | _screenshots/django-admin.png_ |

## Локальная разработка

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DB_HOST=localhost POSTGRES_DB=caravan POSTGRES_USER=caravan POSTGRES_PASSWORD=caravan_secret
export DEBUG=True
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Лицензия

MIT
