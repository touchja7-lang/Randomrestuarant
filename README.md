# 🎲 RandomEats — Restaurant & Menu Randomizer

> MERN Stack Monorepo – สุ่มร้านอาหารและสุ่มเมนูเด็ด หมดปัญหา "วันนี้กินอะไรดี?"  
> รวบรวมร้านดังย่าน **สามย่าน • จุฬาฯ • บรรทัดทอง** จาก Wongnai กว่า 20 ร้าน พร้อมข้อมูลและเมนูแนะนำ พร้อมใช้งานและ Deploy ขึ้น Production ได้ทันที!

---

## ✨ ไฮไลต์ฟีเจอร์หลัก (Key Features)

1. **🎲 สุ่มร้านอาหาร (Restaurant Randomizer)**
   - วงล้อ Slot Roulette แอนิเมชันลื่นไหล นุ่มนวล รองรับ `prefers-reduced-motion`
   - กรองตามแท็กประเภทอาหาร (สุกี้, ชาบู, ก๋วยเตี๋ยว, ข้าวต้ม, ส้มตำ, ขนมหวาน ฯลฯ)
   - กรองตามช่วงราคา (฿ ประหยัด, ฿฿ ปานกลาง, ฿฿฿ พรีเมียม)
   - ลิงก์ตรงเปิดดูตำแหน่งร้านบน **Google Maps** และเปิดอ่านรีวิวตัวจริงบน **Wongnai**

2. **🍜 สุ่มเมนูอาหารประจำร้าน (Signature Menu Randomizer)**
   - สุ่มได้ทั้งจากหน้าผลลัพธ์ของร้าน หรือหน้าโปรไฟล์ร้าน
   - แก้ปัญหาเลือกร้านได้แล้วแต่ "ไม่รู้จะสั่งเมนูไหนดี" ด้วยการสุ่มเมนูซิกเนเจอร์พร้อมแอนิเมชันลูกเต๋า 🎲

3. **🏪 รวม 20 ร้านดัง Wongnai พร้อมเมนูซิกเนเจอร์ในตัว (Preloaded Data)**
   - เจ๊โอว ข้าวต้มเป็ด, กวงเฮงข้าวมันไก่, ชาบูแล็บ, เอี้ยวฮั้วสุกี้โบราณ, โจ๊กสามย่าน, ส้มตำเจ๊แดง, ถ้วยถังไอติม, เจ๊เกียงเป็ดพะโล้, รสดีเด็ด, ป้านี กุ้งแช่น้ำปลา, ข้าวต้มปลาสะพานเหลือง, ปรุง บรรทัดทอง, หนิงหนิง นมสดโบราณ, ฉั่วคิมเฮง, ครัวจุฬา 50, หมูสะเต๊ะนายซ้ง, ไฮเช็งก๋วยเตี๋ยวลูกชิ้นปลา ฯลฯ
   - มีข้อมูลครบถ้วน: รูปภาพ, คำบรรยาย, ที่อยู่, พิกัดแผนที่, ลิงก์ Wongnai, และรายการเมนูแนะนำ

4. **⚡ ดึงข้อมูลร้านอัตโนมัติ (Wongnai & Google Maps Auto-Fill)**
   - นำ URL ร้านจาก Wongnai หรือ Google Maps มาวางในหน้าเพิ่มร้าน ระบบจะดึงชื่อ, ที่อยู่, รีวิว, รูปภาพให้อัตโนมัติ

5. **🔤 Clean Typography: Inter & Noto Sans Thai**
   - ใช้แบบอักษรสากล **Inter** ผสานกับ **Noto Sans Thai** เพื่อความคมชัด อ่านง่าย สบายตาทุกขนาดหน้าจอ

6. **🛡️ Zero-Config Database (พร้อมรันได้ทุกที่)**
   - หากมี **MongoDB** (Local หรือ Atlas) ระบบจะเชื่อมต่อและ auto-seed ข้อมูลให้ทันที
   - หากไม่มี MongoDB หรือระบบออฟไลน์ ตัวระบบมี **Embedded JSON Storage** สำรองอัตโนมัติ ไม่เกิดปัญหาเซิร์ฟเวอร์ Crash

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons |
| **State & Fetching** | TanStack Query (React Query v5), Axios |
| **Forms & Validation** | React Hook Form, Zod (Full type safety) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB (Mongoose) + Fallback Embedded JSON Storage |
| **Deployment** | Dockerfile multi-stage, SPA Static Routing, Vercel ready |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
Random-restuarant/
├── package.json              # Monorepo workspaces (root scripts)
├── Dockerfile                # Production multi-stage Docker build
├── .dockerignore
├── client/                   # Frontend (React 18 + Vite + TS)
│   ├── src/
│   │   ├── api/              # Axios client & endpoints
│   │   ├── components/       # UI (RandomResultCard, SpinButton, etc.)
│   │   ├── data/             # Preset 20 Wongnai restaurants (offline fallback)
│   │   ├── hooks/            # TanStack Query custom hooks
│   │   ├── pages/            # RandomPage, Directory, Detail, Form, History
│   │   └── types/            # TypeScript interfaces
│   ├── vercel.json           # SPA rewrites config for Vercel
│   └── vite.config.ts
└── server/                   # Backend (Node.js + Express + TS)
    ├── data/                 # Embedded restaurants JSON storage
    ├── src/
    │   ├── config/db.ts      # Resilient DB connection with fallback
    │   ├── controllers/      # REST API handlers
    │   ├── data/             # Preset restaurants with signature menus
    │   ├── models/           # Mongoose schemas
    │   ├── routes/           # Express routers (/restaurants, /random, /history)
    │   ├── services/         # Scraper, store service
    │   └── app.ts            # Express setup + SPA static serving
    └── tsconfig.json
```

---

## 🚀 เริ่มต้นใช้งานบนเครื่องตัวเอง (Local Development)

### 1. ติดตั้ง Dependencies ทั้งหมด
```bash
npm install
```

### 2. กำหนดค่า Environment Variables (Optional)
สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` (ดูตัวอย่างที่ `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/random-restaurant
JWT_SECRET=super_secret_jwt_key
CLIENT_URL=
```
*(หากไม่ได้ติดตั้ง MongoDB ในเครื่อง ระบบจะเปิดใช้งานโหมด Local JSON อัตโนมัติทันที)*

### 3. รัน Development Server
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🌐 คู่มือการ Deploy ขึ้น Production (Deployment Guide)

โปรเจกต์นี้ได้รับการปรับแต่งให้รองรับการ Deploy ทั้ง 3 รูปแบบอย่างสมบูรณ์แบบ:

### รูปแบบที่ 1: Deploy รวมเป็น Web Service เดียว (แนะนำ — ง่ายที่สุด)
> ใช้บริการอย่าง **Render**, **Railway**, **Fly.io**, หรือ **VPS** โดยเซิร์ฟเวอร์ Express จะทำหน้าที่เสิร์ฟทั้ง Backend API และไฟล์ Frontend React SPA ในพอร์ตเดียวแบบ All-in-One

1. Push โค้ดทั้งหมดขึ้น GitHub
2. ไปที่ [Render.com](https://render.com) หรือ [Railway.app](https://railway.app) แล้วสร้าง **New Web Service** จาก GitHub Repository ของคุณ
3. ตั้งค่า Build & Start Command:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. ตั้งค่า Environment Variables (ในแท็บ Environment):
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (หรือปล่อยให้ Cloud Host กำหนดอัตโนมัติ)
   - `MONGODB_URI` = *(ใส่ Connection string จาก [MongoDB Atlas](https://www.mongodb.com/atlas) หรือปล่อยว่างเพื่อใช้ไฟล์ JSON)*
   - `JWT_SECRET` = `your_random_secure_secret_key`
5. กด **Deploy** — ใช้งานได้ทันที 100%!

---

### รูปแบบที่ 2: แยก Deploy (Frontend บน Vercel + Backend บน Render/Railway)

#### ขั้นตอนที่ 1: Deploy Backend (Render / Railway)
- **Root Directory**: `server` (หรือ Root repo)
- **Build Command**: `npm run build --workspace=server`
- **Start Command**: `node dist/server.js`
- **Environment Variables**:
  - `NODE_ENV` = `production`
  - `CLIENT_URL` = `https://<your-client-subdomain>.vercel.app`
  - `MONGODB_URI` = `mongodb+srv://...` (หรือเว้นว่าง)
  - `JWT_SECRET` = `your_random_secure_secret_key`

#### ขั้นตอนที่ 2: Deploy Frontend (Vercel)
- นำเข้าโปรเจกต์บน [Vercel](https://vercel.com)
- **Root Directory**: `client`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL` = `https://<your-backend-api-subdomain>.onrender.com/api/v1`
*(มีไฟล์ `client/vercel.json` ป้องกันปัญหา 404 เมื่อกด Refresh ในหน้าย่อยไว้เรียบร้อยแล้ว)*

---

### รูปแบบที่ 3: Deploy ด้วย Docker Container

สามารถ Build และ Run ได้ทันทีด้วยคำสั่งเดียว:
```bash
# 1. Build Docker image
docker build -t randomeats .

# 2. Run container
docker run -d -p 5000:5000 --name randomeats-app randomeats
```
จากนั้นเปิดเว็บเบราว์เซอร์ไปที่ `http://localhost:5000`

---

## 📡 API Reference

Base URL: `/api/v1`

### Health Check
- `GET /health` หรือ `GET /api/v1/health` — ตรวจสอบสถานะเซิร์ฟเวอร์

### Restaurants (`/api/v1/restaurants`)
| Method | Path | Description |
|---|---|---|
| `GET` | `/` | ดึงรายการร้านทั้งหมด (ค้นหา, กรองราคา, แท็ก, pagination) |
| `POST` | `/` | เพิ่มร้านอาหารใหม่ (พร้อมรายการเมนูแนะนำ `menus`) |
| `GET` | `/:id` | ดูข้อมูลร้านอาหารรายร้าน |
| `PATCH` | `/:id` | แก้ไขข้อมูลร้านอาหาร |
| `DELETE` | `/:id` | ลบร้านอาหาร |
| `POST` | `/parse-url` | ดึงข้อมูลร้านอัตโนมัติจากลิงก์ Wongnai / Google Maps |

### Randomizer (`/api/v1/random`)
| Method | Path | Description |
|---|---|---|
| `POST` | `/restaurant` | สุ่มร้านอาหารตามเงื่อนไข (Tags, PriceRange, OpenNow, ExcludeIds) |

### History (`/api/v1/history`)
| Method | Path | Description |
|---|---|---|
| `GET` | `/` | ดึงประวัติการสุ่มร้านอาหารล่าสุด |

---

## 📝 License
MIT License
