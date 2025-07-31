from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import pandas as pd
from io import StringIO

# In-memory "database"
fake_users_db = {}

# JWT config
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class User(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Utilities
def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email not in fake_users_db:
            raise HTTPException(status_code=401, detail="Invalid token")
        return fake_users_db[email]
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid or expired")

# Authentication routes
@app.post("/signup")
def signup(user: User):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    fake_users_db[user.email] = {
        "username": user.username,
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
    }
    return {"message": "Signup successful"}

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer"}

# Data analysis endpoints (protected)
dataframe = pd.DataFrame()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    global dataframe
    contents = await file.read()
    dataframe = pd.read_csv(StringIO(contents.decode("utf-8")))
    return {"message": "File uploaded successfully", "rows": len(dataframe)}

@app.get("/analyze")
def analyze_data(current_user=Depends(get_current_user)):
    if dataframe.empty:
        return {"error": "No data uploaded"}
    return {
        "total_customers": dataframe["CustomerID"].nunique(),
        "total_sales": dataframe["Amount"].sum(),
        "avg_purchase": dataframe["Amount"].mean(),
        "top_customers": dataframe.groupby("CustomerID")["Amount"]
            .sum().nlargest(5).to_dict()
    }
