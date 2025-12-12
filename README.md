# ☁️ Smart Cloud

**Smart Cloud** is an intelligent document management platform that solves the biggest problem with cloud storage: **Organization.** Instead of forcing you to manually sort files into folders, Smart Cloud uses **Generative AI** to automatically categorize, tag, and summarize every document you upload. It replaces keyword search with **Semantic Search**, allowing you to find files based on what they *mean*, not just what they are named.


## 🚀 Live Demo

- **Frontend (Vercel):** [https://smart-cloud.vercel.app/](https://smart-cloud.vercel.app/)
- **Backend API (Render):** [https://smart-cloud-backend.onrender.com/docs](https://smart-cloud-backend.onrender.com/docs)

---

## 🌟 Why Smart Cloud? (The "Smart" Factors)

### 1. 🏷️ Zero-Touch Auto-Categorization
Stop wasting time creating folders. As soon as you upload a file, **Gemini AI** analyzes the content and automatically assigns it to the correct category (e.g., *Legal, Finance, Medical, Career*).
> **Example:** Upload a file named `scan_2024.pdf`. The AI reads it, realizes it's a resume, and instantly tags it as **"Career"** with a generated summary.

### 2. 🧠 Context-Aware Smart Search
Forget exact filename matches. Smart Cloud uses **Vector Embeddings (Voyage AI)** to understand your search intent.
> **Example:** You search for *"how much did I spend on groceries?"*. The system finds your file named `receipt_december.png` because it understands the context of the document content.

---

## 📸 Screenshots

### **Interactive Dashboard**
Visual analytics of storage usage, file types, and recent activity.
<img width="1876" height="867" alt="Screenshot 2025-12-12 101918" src="https://github.com/user-attachments/assets/03d617de-2ac2-4145-a24f-5772ae7d2fc6" />


### **Smart File Upload**
Drag-and-drop interface with immediate AI processing.
<img width="1906" height="867" alt="Screenshot 2025-12-12 101851" src="https://github.com/user-attachments/assets/118db2de-b9e8-46a3-8f68-8c5489c418d3" />


### **Organized File Management**
Categorized views with AI-generated summaries and semantic search.
<img width="1538" height="748" alt="Screenshot 2025-12-12 101947" src="https://github.com/user-attachments/assets/3ffb764c-09bf-468a-b4af-3b0cc769a69c" />


---

## ✨ Key Features

* **🔐 Secure Authentication:** Robust user management (Sign Up, Login, Logout) powered by **Supabase Auth**.
* **📂 Smart File Management:** Upload, organize, and manage files with real-time storage tracking.
* **🤖 AI-Powered Summarization:** Automatically generates concise summaries of uploaded documents using **Google Gemini AI**.
* **🔍 Semantic Search:** Find files by *meaning*, not just keywords. Uses **Voyage AI** embeddings and **pgvector** for high-accuracy retrieval.
* **📊 Interactive Dashboard:** Visual analytics of storage usage, file types, and upload trends.
* **🔗 Secure Sharing:** Generate time-limited, password-protected public links for file sharing.
* **📱 Responsive UI:** Modern, dark-mode ready interface built with **React**, **Tailwind CSS**, and **Shadcn/UI**.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Shadcn/UI
* **State/API:** Axios, React Router, Context API
* **Icons:** Lucide React

### **Backend**
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Database:** Supabase (PostgreSQL + pgvector)
* **Storage:** Supabase Storage (S3 compatible)
* **AI Integration:** Google Gemini (Content Generation), Voyage AI (Embeddings)

### **Deployment**
* **Frontend:** Vercel
* **Backend:** Render

---

## ⚙️ Architecture

The application follows a decoupled microservices architecture:

1.  **Frontend:** A React SPA interacting with the backend via RESTful API calls.
2.  **Backend:** A FastAPI service that orchestrates DB operations, file handling, and AI processing.
3.  **Database:** PostgreSQL stores metadata and vector embeddings; Supabase Storage holds the actual files.
4.  **AI Services:** External calls to Gemini and Voyage AI for processing content.

---
