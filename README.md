
# 🏙️ ThreadsCity

### Nền tảng Mạng Xã Hội & Diễn Đàn Thảo Luận Trực Tuyến

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**ThreadsCity** là một nền tảng diễn đàn thảo luận trực tuyến kết hợp mạng xã hội, được phát triển với mục tiêu tạo ra một không gian trao đổi mở, an toàn và hiện đại cho người dùng.

[Tính năng](#-tính-năng-chính) • [Kiến trúc](#-kiến-trúc-hệ-thống) • [Cài đặt](#-cài-đặt) • [API](#-api-endpoints) • [Đóng góp](#-đóng-góp)

</div>

---

## 📋 Mục Lục

- [Tính năng chính](#-tính-năng-chính)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Biến môi trường](#-biến-môi-trường)
- [API Endpoints](#-api-endpoints)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

---

## ✨ Tính Năng Chính

### 🔐 Xác thực & Phân quyền
- Đăng ký / Đăng nhập bằng **email & mật khẩu** (bcrypt hash)
- Đăng nhập bằng **Google OAuth 2.0**
- Xác thực **JWT** (Access Token + Refresh Token)
- Phân quyền theo vai trò: `user` và `admin`
- Middleware bảo vệ route

### 📝 Bài viết & Tương tác
- Tạo, chỉnh sửa, xoá bài viết
- Hỗ trợ đa phương tiện: **text, hình ảnh, video**
- Upload media lên **Cloudinary**
- Thả tim (like) bài viết
- Bình luận bài viết (hỗ trợ nested comments)
- Skeleton loading cho trải nghiệm mượt mà

### 💬 Nhắn tin Realtime
- Chat 1-1 qua **WebSocket** (Django Channels)
- Widget nhắn tin tích hợp trên giao diện chính
- Danh sách hội thoại, hiển thị tin nhắn realtime

### 👥 Kết bạn & Follow
- Gửi / chấp nhận / từ chối lời mời kết bạn
- Hệ thống follow giống mô hình mạng xã hội phổ biến
- Tìm kiếm người dùng

### 🔔 Thông báo Realtime
- Thông báo kết bạn, like, comment qua **WebSocket**
- Badge thông báo chưa đọc
- Trang thông báo chi tiết

### 🤖 AI Kiểm duyệt Nội dung
- **Kiểm duyệt hình ảnh & video**: Tự động phát hiện nội dung nhạy cảm (vũ khí, bạo lực, thuốc lá) sử dụng mô hình **YOLOv8** (Ultralytics).
- **Kiểm duyệt văn bản**: Tự động nhận diện và ẩn (mask) các từ ngữ độc hại trong bài viết bằng mô hình **PhoBERT** (Transformers).
- Bài viết cần kiểm duyệt trước khi hiển thị công khai
- Trang Admin quản lý bài viết chờ duyệt / đã duyệt

### 🛡️ Trang Quản trị (Admin)
- Dashboard quản lý bài viết chờ kiểm duyệt (`PendingModerationPage`)
- Trang bài viết đã duyệt (`ApprovedPostsPage`)
- Phân quyền admin riêng biệt

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│        React 19 + TypeScript + TailwindCSS 4            │
│         Vite · Redux Toolkit · Framer Motion            │
│                                                         │
│   ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│   │  Auth   │  │  Posts   │  │   Chat   │  │ Admin  │  │
│   │  Pages  │  │  Feed    │  │  Widget  │  │ Panel  │  │
│   └────┬────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │
│        │            │             │             │        │
└────────┼────────────┼─────────────┼─────────────┼────────┘
         │   REST API │             │ WebSocket   │
         ▼            ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│           Django 5.2 + Django REST Framework             │
│           Django Channels (WebSocket / ASGI)             │
│                                                         │
│   ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────────────────┐│
│   │user_auth │ │ post │ │  chat  │ │  notifications   ││
│   │  users   │ │      │ │        │ │     friend       ││
│   └────┬─────┘ └──┬───┘ └───┬────┘ └──────┬───────────┘│
│        │          │         │              │            │
│        └──────────┴─────────┴──────────────┘            │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │  Cloudinary  │  │  AI Service  │
│  (Database)  │  │   (Media)    │  │  (FastAPI)   │
│              │  │              │  │   YOLOv8 +   │
│              │  │              │  │   PhoBERT    │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|:---|:---|:---|
| React | 19.1 | UI Library |
| TypeScript | 5.8 | Type-safe JavaScript |
| Vite | 6.3 | Build tool & dev server |
| TailwindCSS | 4.1 | Utility-first CSS framework |
| Redux Toolkit | 2.8 | State management |
| Redux Persist | 6.0 | Persist Redux store |
| React Router DOM | 7.8 | Client-side routing |
| Framer Motion | 12.x | Animation library |
| Axios | 1.11 | HTTP client |
| Lucide React | 0.541 | Icon library |
| Emoji Picker React | 4.13 | Emoji picker component |
| React Hot Toast | 2.6 | Toast notifications |
| React Loading Skeleton | 3.5 | Skeleton loading |

### Backend
| Công nghệ | Mô tả |
|:---|:---|
| Django | 5.2 – Web framework chính |
| Django REST Framework | RESTful API |
| Django Channels | WebSocket support (ASGI) |
| Daphne | ASGI server |
| PyMongo | MongoDB driver |
| PyJWT | JSON Web Token |
| bcrypt | Password hashing |
| Cloudinary | Media storage & CDN |
| Google Auth | OAuth 2.0 authentication |
| CORS Headers | Cross-Origin Resource Sharing |

### AI Service
| Công nghệ | Mô tả |
|:---|:---|
| FastAPI | API framework cho AI service |
| YOLOv8 | Object Detection (Vũ khí, bạo lực, thuốc lá) |
| Ultralytics | Thư viện triển khai YOLOv8 |
| PhoBERT | NLP Model kiểm duyệt văn bản tiếng Việt |
| Transformers | Thư viện nền tảng cho PhoBERT |
| PyTorch | Framework nền tảng cho AI models |
| OpenCV | Xử lý hình ảnh và dữ liệu video |

### Infrastructure
| Công nghệ | Mô tả |
|:---|:---|
| MongoDB | NoSQL Database |
| Cloudinary | Cloud-based media management |
| Redis *(planned)* | Channel layer cho WebSocket |

---

## 📁 Cấu Trúc Dự Án

```
ThreadsCity/
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── admin/              # Trang quản trị
│   │   │   ├── ApprovedPostsPage.tsx
│   │   │   ├── PendingModerationPage.tsx
│   │   │   └── layout.tsx
│   │   ├── auth/               # Xác thực
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── logout.tsx
│   │   ├── components/         # UI Components
│   │   │   ├── chat/           # Chat components
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   └── MessageWidget.tsx
│   │   │   ├── comment/        # Comment components
│   │   │   ├── post.tsx        # Post component
│   │   │   ├── postlist.tsx    # Post list
│   │   │   ├── postmodel.tsx   # Post modal (create/edit)
│   │   │   ├── sidebar.tsx     # Sidebar navigation
│   │   │   └── ...Skeleton.tsx # Skeleton loaders
│   │   ├── pages/              # Pages
│   │   │   ├── home.tsx        # Trang chủ / Feed
│   │   │   ├── profileUser.tsx # Trang cá nhân
│   │   │   ├── search.tsx      # Tìm kiếm
│   │   │   ├── notifications.tsx
│   │   │   └── postcomment.tsx # Chi tiết bài viết
│   │   ├── redux/              # State management
│   │   │   ├── api/            # API calls
│   │   │   ├── slice/          # Redux slices
│   │   │   └── store.ts
│   │   ├── middleware/         # Route protection
│   │   ├── axios/              # Axios config
│   │   ├── hook/               # Custom hooks
│   │   ├── lib/                # Utilities (WebSocket, etc.)
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                    # Django Backend
│   ├── myapp/
│   │   ├── myapp/              # Django project config
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── asgi.py
│   │   │   └── wsgi.py
│   │   ├── user_auth/          # Xác thực (login, register, JWT)
│   │   ├── users/              # Quản lý người dùng
│   │   ├── post/               # Quản lý bài viết
│   │   ├── comments/           # Bình luận
│   │   ├── chat/               # Nhắn tin realtime (WebSocket)
│   │   ├── friend/             # Kết bạn / Follow
│   │   ├── notifications/      # Thông báo realtime (WebSocket)
│   │   ├── Middleware/         # Custom middleware
│   │   ├── utils/              # Tiện ích
│   │   ├── manage.py
│   │   └── requirements.txt
│   ├── .env
│   └── .env.example
│
├── ai_service/                 # AI Content Moderation
│   ├── app/
│   │   ├── main.py             # FastAPI entry point
│   │   ├── routers/            # API routes
│   │   └── services/           # Business logic
│   ├── models/
│   │   ├── predict_img/        # YOLOv8 Image/Video Moderation
│   │   └── predict_text/       # PhoBERT Text Moderation
│   ├── inputs/                 # Sample inputs
│   ├── utils/                  # Utilities
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Cài Đặt

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **Python** >= 3.10
- **MongoDB** (local hoặc MongoDB Atlas)
- **Redis** *(tùy chọn, cho WebSocket production)*
- **Git**

### 1. Clone repository

```bash
git clone https://github.com/PhanVanTann/ThreadsCity.git
cd ThreadsCity
```

### 2. Cài đặt Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với giá trị phù hợp

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Cài đặt Backend

```bash
cd backend

# Tạo virtual environment
python -m venv venv
source venv/bin/activate    # macOS/Linux
# venv\Scripts\activate     # Windows

# Cài đặt dependencies
pip install -r myapp/requirements.txt

# Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với giá trị phù hợp

# Chạy server
cd myapp
daphne -b 0.0.0.0 -p 8000 myapp.asgi:application
# Hoặc: python manage.py runserver
```

Backend sẽ chạy tại: `http://localhost:8000`

### 4. Cài đặt AI Service

```bash
cd ai_service

# Tạo virtual environment
python -m venv venv
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env
cp .env.example .env

# Chạy AI service
uvicorn app.main:app --reload --port 8001
```

AI Service sẽ chạy tại: `http://localhost:8001`

---

## 🔑 Biến Môi Trường

### Backend (`.env`)

| Biến | Mô tả |
|:---|:---|
| `MOGO_URL` | MongoDB connection string |
| `MOGO_DB_NAME` | Tên database (mặc định: `ThreadsCity`) |
| `SECRET_KEY` | Django secret key |
| `EMAIL_BACKEND` | `django.core.mail.backends.smtp.EmailBackend` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USE_TLS` | `True` |
| `EMAIL_HOST_USER` | Email gửi thông báo |
| `EMAIL_HOST_PASSWORD` | App password của email |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `API_KEY` | Cloudinary API Key |
| `API_SECRET` | Cloudinary API Secret |
| `CLOUD_NAME` | Cloudinary Cloud Name |

### Frontend (`.env`)

| Biến | Mô tả |
|:---|:---|
| `VITE_API_URL` | URL Backend API (e.g., `http://localhost:8000`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

### AI Service (`.env`)

| Biến | Mô tả |
|:---|:---|
| `API_KEY` | Cloudinary API Key |
| `API_SECRET` | Cloudinary API Secret |
| `CLOUD_NAME` | Cloudinary Cloud Name |

---

## 📡 API Endpoints

### Authentication (`/api/auth/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `POST` | `/api/auth/register/` | Đăng ký tài khoản |
| `POST` | `/api/auth/login/` | Đăng nhập |
| `POST` | `/api/auth/google/` | Đăng nhập Google OAuth |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `POST` | `/api/auth/logout/` | Đăng xuất |

### Users (`/api/users/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `GET` | `/api/users/:id/` | Lấy thông tin user |
| `PUT` | `/api/users/:id/` | Cập nhật profile |
| `GET` | `/api/users/search/` | Tìm kiếm user |

### Posts (`/api/post/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `GET` | `/api/post/` | Lấy danh sách bài viết |
| `POST` | `/api/post/` | Tạo bài viết mới |
| `PUT` | `/api/post/:id/` | Chỉnh sửa bài viết |
| `DELETE` | `/api/post/:id/` | Xoá bài viết |
| `POST` | `/api/post/:id/like/` | Like / unlike bài viết |

### Comments (`/api/comments/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `GET` | `/api/comments/:post_id/` | Lấy comments của bài viết |
| `POST` | `/api/comments/` | Tạo comment mới |

### Friends (`/api/friend/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `POST` | `/api/friend/request/` | Gửi lời mời kết bạn |
| `POST` | `/api/friend/accept/` | Chấp nhận kết bạn |
| `POST` | `/api/friend/reject/` | Từ chối kết bạn |

### Chat (`/api/chat/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `GET` | `/api/chat/rooms/` | Danh sách phòng chat |
| `GET` | `/api/chat/messages/:room_id/` | Lấy tin nhắn |

### WebSocket
| Endpoint | Mô tả |
|:---|:---|
| `ws://host/ws/chat/<room_id>/` | Chat realtime |
| `ws://host/ws/notifications/` | Thông báo realtime |

### AI Service (`/ai/`)
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| `POST` | `/ai/predict-image/` | Kiểm duyệt hình ảnh |
| `POST` | `/ai/predict-text/` | Kiểm duyệt văn bản |

---

## 🤝 Đóng Góp

Chúng tôi luôn hoan nghênh mọi đóng góp! Để đóng góp vào dự án:

1. **Fork** repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m "Thêm tính năng XYZ"`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo **Pull Request**

---

## 👥 Tác Giả

- **Phan Văn Tân** – [@PhanVanTann](https://github.com/PhanVanTann)

---

## 📄 Giấy Phép

Dự án này được phát triển phục vụ mục đích học tập và thực tập tốt nghiệp.

---

<div align="center">

**⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé! ⭐**

</div>
]]>
