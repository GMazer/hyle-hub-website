# HyleHub Store

Dự án này đã được chia thành các phần độc lập:

1. **Frontend (Root)**: Ứng dụng Landing Page cho khách hàng.
   - Entry point: `index.html` (root)
   - Chạy lệnh: `npm start` (hoặc tương đương)

2. **Backend**: Thư mục `backend/`
   - API Node.js/Express
   - Triển khai trên Render.

3. **Admin Web**: Thư mục `admin-app/`
   - Đây là một ứng dụng React riêng biệt hoàn toàn.
   - Để chạy preview trên WebStorm: Mở thư mục `admin-app` như một project riêng -> chạy `npm install` -> `npm run dev`.

## Cấu trúc thư mục

```
/
├── admin-app/          <-- Web Quản trị (React App độc lập)
│   ├── index.html
│   ├── package.json
│   └── src/
├── backend/            <-- API Server
└── (Root files)        <-- Web Landing Page (Khách hàng)
```
