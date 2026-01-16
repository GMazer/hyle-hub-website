# HyleHub Store

Dự án này bao gồm hai phần chính: Front-end và Back-end.

## Cấu trúc thư mục (Hướng dẫn Deploy)

Để triển khai theo yêu cầu (Backend trên Render, Frontend trên Netlify), bạn nên sắp xếp lại cấu trúc thư mục sau khi tải code về như sau:

```
/ (Root)
├── backend/            <-- Deploy thư mục này lên Render
│   ├── package.json
│   ├── server.js
│   └── data.js
│
└── frontend/           <-- Di chuyển các file còn lại vào đây và Deploy lên Netlify
    ├── index.html
    ├── index.tsx
    ├── App.tsx
    ├── types.ts
    ├── metadata.json
    ├── tailwind setup...
    ├── components/
    ├── pages/
    └── services/
```

**Lưu ý:** Trong môi trường xem trước này, các file Front-end đang được giữ ở thư mục gốc để đảm bảo ứng dụng chạy được ngay lập tức.

## Kết nối API

Hiện tại Front-end đang sử dụng `mockApi` (giả lập dữ liệu và lưu vào LocalStorage). 

Để kết nối với Backend thực tế sau khi deploy:
1. Sửa file `services/mockApi.ts` (hoặc tạo `services/api.ts`).
2. Thay thế logic đọc/ghi LocalStorage bằng `fetch('https://your-render-url.com/api/...')`.
