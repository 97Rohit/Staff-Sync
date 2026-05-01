from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import init_db
from routes import employees, attendance, dashboard

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    init_db()
    yield


app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include backend routes
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

# Serve frontend static files (Vite build)
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

# Serve frontend (main page)
@app.get("/")
def serve_frontend():
    return FileResponse("dist/index.html")

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}