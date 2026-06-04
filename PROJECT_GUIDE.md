# PROJECT_GUIDE — Караван B2B

Подробное руководство для разработчиков по поддержке и развитию системы «Караван».

---

## 1. Архитектура проекта

Система построена по классической **трёхслойной архитектуре**:

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   React SPA │────▶│    Nginx    │────▶│ Django + DRF │
│  (Frontend) │     │   :80       │     │   :8000      │
└─────────────┘     └─────────────┘     └──────┬───────┘
                                               │
                                        ┌──────▼───────┐
                                        │  PostgreSQL  │
                                        │    :5432     │
                                        └──────────────┘
```

### Принципы

- **Backend**: Django-приложения с разделением ответственности (SRP). Бизнес-логика заказов вынесена в `orders/services.py`.
- **Frontend**: SPA на React с маршрутизацией по ролям, централизованным API-клиентом (Axios) и кэшированием (React Query).
- **Auth**: Stateless JWT (SimpleJWT) с rotation refresh-токенов и blacklist.
- **RBAC**: Permission-классы в `caravan/permissions.py` + проверка ролей на frontend.

---

## 2. Структура папок

### Корень проекта

| Путь | Назначение |
|------|------------|
| `backend/` | Django-проект и приложения |
| `frontend/` | React SPA |
| `nginx/` | Конфигурация reverse proxy |
| `docker-compose.yml` | Оркестрация контейнеров |
| `.env.example` | Шаблон переменных окружения |

### Backend

| Путь | Назначение |
|------|------------|
| `caravan/` | settings, urls, permissions, exceptions |
| `accounts/` | User, auth API, регистрация |
| `stores/` | Модель магазина |
| `products/` | Категории и товары |
| `orders/` | Заказы, OrderItem, сервисы |
| `dashboard/` | Агрегированная статистика |
| `notifications/` | In-app уведомления |

### Frontend

| Путь | Назначение |
|------|------------|
| `pages/` | Страницы (public, customer, admin) |
| `components/` | Переиспользуемые UI-компоненты |
| `layouts/` | PublicLayout, AppLayout |
| `services/` | HTTP-клиенты к API |
| `store/` | Zustand: auth, cart, theme |
| `hooks/` | useAuth и др. |
| `types/` | TypeScript интерфейсы |
| `utils/` | Форматирование, константы |
| `theme/` | MUI theme (light/dark) |

---

## 3. Django-приложения

### accounts

- Кастомная модель `User` с полями `phone`, `role`, `store`
- Роли: `ADMIN`, `PRODUCT_MANAGER`, `CUSTOMER`
- API: register, login, refresh, logout, profile, users (admin)

### stores

- Модель `Store` — магазин заказчика
- Связь: `User.store` → Store, `Store.owner` → User

### products

- `Category` — категории с изображением
- `Product` — товар с артикулом, ценой, остатком
- Фильтрация, поиск, сортировка через DRF + django-filter

### orders

- `Order`, `OrderItem`, статусы NEW → DELIVERED / CANCELED
- `OrderService.create_order()` — транзакционное создание с проверкой остатков
- `OrderService.update_status()` — смена статуса + уведомление клиенту

### dashboard

- `GET /api/dashboard/admin/` — полная статистика для админа
- `GET /api/dashboard/customer/` — статистика заказчика
- `GET /api/dashboard/manager/` — сводка для менеджера товаров

### notifications

- In-app уведомления в БД
- Триггеры: новый заказ (→ admin), смена статуса (→ customer)

---

## 4. Модели базы данных

### User

| Поле | Тип | Описание |
|------|-----|----------|
| id | PK | |
| username | str | Уникальный логин |
| first_name, last_name | str | ФИО |
| email | str | Уникальный email |
| phone | str | Телефон |
| role | enum | ADMIN / PRODUCT_MANAGER / CUSTOMER |
| store | FK | Магазин (для CUSTOMER) |
| is_active | bool | |
| created_at, updated_at | datetime | |

### Store

| Поле | Тип |
|------|-----|
| name, address, phone, email | |
| owner | FK → User |
| created_at | datetime |

### Category / Product / Order / OrderItem / Notification

См. модели в `products/models.py`, `orders/models.py`, `notifications/models.py`.

---

## 5. API Endpoints

### Auth

| Method | URL | Доступ |
|--------|-----|--------|
| POST | `/api/auth/register/` | Public |
| POST | `/api/auth/login/` | Public |
| POST | `/api/auth/refresh/` | Public |
| POST | `/api/auth/logout/` | Auth |
| POST | `/api/auth/password-reset/` | Public |
| POST | `/api/auth/password-reset/confirm/` | Public |
| GET/PUT | `/api/auth/profile/` | Auth |
| GET/POST | `/api/auth/users/` | Admin |
| GET/PUT/DELETE | `/api/auth/users/{id}/` | Admin |

### Stores, Categories, Products, Orders, Dashboard, Notifications

Полный список — в Swagger: `/api/docs/`

---

## 6. Роли пользователей

| Роль | Код | Возможности |
|------|-----|-------------|
| Администратор | ADMIN | Полный доступ: заказы, пользователи, товары, статистика |
| Менеджер товаров | PRODUCT_MANAGER | Только товары и категории |
| Заказчик | CUSTOMER | Каталог, корзина, свои заказы, профиль |

---

## 7. JWT Authentication

1. **Login** → `{ access, refresh }`
2. **Access token** передаётся в заголовке: `Authorization: Bearer <token>`
3. **Refresh** → `/api/auth/refresh/` с `{ refresh }` → новый access (+ refresh при ROTATE)
4. **Logout** → blacklist refresh token

Настройки в `caravan/settings.py` → `SIMPLE_JWT`.

Frontend: interceptors в `services/api.ts` автоматически обновляют access при 401.

---

## 8. Как добавлять товары

### Через веб (Admin / Manager)

1. Войти как admin или product_manager
2. Перейти в «Товары» → «Добавить»
3. Заполнить: название, артикул, категорию, цену, остаток

### Через API

```bash
curl -X POST http://localhost/api/products/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Новый товар" \
  -F "article=SKU-001" \
  -F "category=1" \
  -F "price=1000" \
  -F "stock_quantity=100"
```

### Через Django Admin

`/admin/` → Товары → Добавить. Поддерживаются inline, массовые действия, поиск.

---

## 9. Как создавать категории

API: `POST /api/categories/` с `{ name, description }` (multipart для image).

Admin: `/admin/` → Категории.

---

## 10. Как работать с заказами

### Заказчик

1. Добавить товары в корзину
2. Оформить заказ (`POST /api/orders/`)
3. Отслеживать статус в «Мои заказы»

### Администратор

1. Получает уведомление о новом заказе
2. Меняет статус: `PATCH /api/orders/{id}/status/` или через Admin
3. Клиент получает уведомление о смене статуса

### Статусы

`NEW` → `CONFIRMED` → `PROCESSING` → `READY_TO_SHIP` → `SHIPPED` → `DELIVERED`

Отмена: `CANCELED`

---

## 11. Как создавать пользователей

### Django Admin

`/admin/` → Пользователи → Добавить

### API (Admin)

```bash
curl -X POST http://localhost/api/auth/users/ \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"manager1","email":"m@local","password":"pass12345","role":"PRODUCT_MANAGER"}'
```

### Регистрация заказчика

Публичный endpoint `POST /api/auth/register/` — создаёт User + Store.

---

## 12. Как назначать роли

1. Django Admin: поле «Роль» при редактировании пользователя
2. API: `PUT /api/auth/users/{id}/` с `{ "role": "PRODUCT_MANAGER" }`

---

## 13. Как запускать проект

### Production (Docker)

```bash
docker-compose up --build -d
```

Контейнеры:
- `db` — PostgreSQL 16
- `backend` — Gunicorn + Django (migrate, collectstatic, seed)
- `frontend` — сборка React → volume
- `nginx` — раздача SPA + proxy API

### Локально

См. README.md → «Локальная разработка».

---

## 14. Деплой на Ubuntu Server

```bash
# 1. Установить Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin

# 2. Клонировать проект
git clone <repo> /opt/caravan && cd /opt/caravan

# 3. Настроить .env (SECRET_KEY, пароли)
cp .env.example .env && nano .env

# 4. Запустить
docker compose up --build -d

# 5. Проверить
curl http://localhost/api/schema/
```

Рекомендуется: firewall (ufw), SSL через Certbot, отдельный домен.

---

## 15. Настройка Nginx

Production-конфиг (вне Docker) — пример:

```nginx
server {
    listen 80;
    server_name caravan.example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
    }

    location /static/ {
        alias /opt/caravan/staticfiles/;
    }

    location /media/ {
        alias /opt/caravan/media/;
    }

    location / {
        root /opt/caravan/frontend/dist;
        try_files $uri /index.html;
    }
}
```

SSL: `certbot --nginx -d caravan.example.com`

---

## 16. Резервное копирование PostgreSQL

```bash
# Backup
docker compose exec db pg_dump -U caravan caravan > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20260101.sql | docker compose exec -T db psql -U caravan caravan
```

Автоматизация (cron):

```cron
0 3 * * * cd /opt/caravan && docker compose exec -T db pg_dump -U caravan caravan | gzip > /backups/caravan_$(date +\%Y\%m\%d).sql.gz
```

---

## 17. Как обновлять проект

```bash
cd /opt/caravan
git pull origin main
docker compose down
docker compose up --build -d
docker compose exec backend python manage.py migrate
```

При изменении статики frontend пересобирается автоматически в Docker build.

---

## 18. Восстановление пароля

### Как работает

1. `POST /api/auth/password-reset/` с email пользователя.
2. Backend генерирует токен (Django `default_token_generator`) и отправляет ссылку на `FRONTEND_URL/password-reset/confirm?uid=...&token=...`.
3. `POST /api/auth/password-reset/confirm/` устанавливает новый пароль.

### Настройка SMTP

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=app-password
DEFAULT_FROM_EMAIL=Караван <noreply@yourdomain.com>
FRONTEND_URL=https://caravan.uz
```

Без `EMAIL_HOST` письма пишутся в консоль (удобно для разработки):

```bash
docker compose logs -f backend
```

---

## 19. Email и SMS уведомления

### Когда отправляются

- **Новый заказ** → администратору (in-app + email + SMS)
- **Смена статуса заказа** → заказчику (in-app + email + SMS)

### Email

```env
NOTIFY_EMAIL=True
```

Используется тот же SMTP, что и для восстановления пароля.

### SMS

По умолчанию SMS выключены и логируются в консоль:

```env
NOTIFY_SMS=True
SMS_ENABLED=True
SMS_PROVIDER=http
SMS_API_URL=https://your-sms-provider.com/api/send
SMS_API_TOKEN=your-token
SMS_SENDER=Caravan
```

HTTP-провайдер отправляет POST JSON:

```json
{ "phone": "77001234567", "message": "текст", "sender": "Caravan" }
```

Подключите свой SMS-шлюз (Eskiz, Twilio, Mobizon и т.д.), указав URL и токен.

---

## Демо-данные

При старте backend выполняется `seed_demo_data` — 4 категории и 8 товаров.

## Контакты и поддержка

Документация API: `/api/docs/`  
Django Admin: `/admin/`  
Логи backend: `docker compose logs -f backend`
