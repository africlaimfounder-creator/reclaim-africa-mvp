from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT configuration
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix='/api')

logger = logging.getLogger(__name__)

# ============ MODELS ============

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    role: str

class ClaimCreate(BaseModel):
    asset_type: str
    claiming_for: str
    documents: List[str]
    full_name: str
    phone: str
    email: EmailStr
    state: str
    company_name: str
    estimated_shares: Optional[str] = None
    estimated_value: Optional[str] = None
    service_tier: str

class ClaimResponse(BaseModel):
    id: str
    user_id: str
    asset_type: str
    claiming_for: str
    documents: List[str]
    full_name: str
    phone: str
    email: str
    state: str
    company_name: str
    estimated_shares: Optional[str]
    estimated_value: Optional[str]
    service_tier: str
    status: str
    created_at: str
    updated_at: str

class ClaimStatusUpdate(BaseModel):
    status: str

# ============ HELPER FUNCTIONS ============

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        'sub': user_id,
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=60),
        'type': 'access'
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        'sub': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
        'type': 'refresh'
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get('access_token')
    if not token:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail='Not authenticated')
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get('type') != 'access':
            raise HTTPException(status_code=401, detail='Invalid token type')
        user = await db.users.find_one({'_id': ObjectId(payload['sub'])})
        if not user:
            raise HTTPException(status_code=401, detail='User not found')
        user['_id'] = str(user['_id'])
        user.pop('password_hash', None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')

# ============ STARTUP ============

@app.on_event('startup')
async def startup():
    await db.users.create_index('email', unique=True)
    await db.claims.create_index('user_id')
    await seed_admin()

async def seed_admin():
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    existing = await db.users.find_one({'email': admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            'email': admin_email,
            'password_hash': hashed,
            'full_name': 'Admin',
            'phone': '',
            'role': 'admin',
            'created_at': datetime.now(timezone.utc)
        })
        logger.info(f'Admin user created: {admin_email}')
    elif not verify_password(admin_password, existing['password_hash']):
        await db.users.update_one(
            {'email': admin_email},
            {'$set': {'password_hash': hash_password(admin_password)}}
        )
        logger.info(f'Admin password updated for: {admin_email}')
    
    # Write test credentials
    Path('/app/memory').mkdir(exist_ok=True)
    with open('/app/memory/test_credentials.md', 'w') as f:
        f.write('# Test Credentials\n\n')
        f.write('## Admin\n')
        f.write(f'- Email: {admin_email}\n')
        f.write(f'- Password: {admin_password}\n')
        f.write('- Role: admin\n\n')
        f.write('## Endpoints\n')
        f.write('- POST /api/auth/register\n')
        f.write('- POST /api/auth/login\n')
        f.write('- GET /api/auth/me\n')
        f.write('- POST /api/auth/logout\n')
        f.write('- POST /api/claims\n')
        f.write('- GET /api/claims\n')
        f.write('- GET /api/admin/claims\n')
        f.write('- PATCH /api/admin/claims/{claim_id}/status\n')

# ============ AUTH ROUTES ============

@api_router.post('/auth/register')
async def register(user: UserRegister, response: Response):
    email_lower = user.email.lower()
    existing = await db.users.find_one({'email': email_lower})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    password_hash = hash_password(user.password)
    user_doc = {
        'email': email_lower,
        'password_hash': password_hash,
        'full_name': user.full_name,
        'phone': user.phone,
        'role': 'user',
        'created_at': datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email_lower)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=3600,
        path='/'
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=604800,
        path='/'
    )
    
    return UserResponse(
        id=user_id,
        email=email_lower,
        full_name=user.full_name,
        phone=user.phone,
        role='user'
    )

@api_router.post('/auth/login')
async def login(credentials: UserLogin, response: Response):
    email_lower = credentials.email.lower()
    user = await db.users.find_one({'email': email_lower})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    
    user_id = str(user['_id'])
    access_token = create_access_token(user_id, email_lower)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=3600,
        path='/'
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=604800,
        path='/'
    )
    
    return UserResponse(
        id=user_id,
        email=email_lower,
        full_name=user.get('full_name', ''),
        phone=user.get('phone', ''),
        role=user.get('role', 'user')
    )

@api_router.get('/auth/me')
async def get_me(request: Request):
    user = await get_current_user(request)
    return UserResponse(
        id=user['_id'],
        email=user['email'],
        full_name=user.get('full_name', ''),
        phone=user.get('phone', ''),
        role=user.get('role', 'user')
    )

@api_router.post('/auth/logout')
async def logout(response: Response):
    response.delete_cookie(key='access_token', path='/')
    response.delete_cookie(key='refresh_token', path='/')
    return {'message': 'Logged out successfully'}

# ============ CLAIMS ROUTES ============

@api_router.post('/claims')
async def create_claim(claim: ClaimCreate, request: Request):
    user = await get_current_user(request)
    
    claim_doc = {
        'user_id': user['_id'],
        'asset_type': claim.asset_type,
        'claiming_for': claim.claiming_for,
        'documents': claim.documents,
        'full_name': claim.full_name,
        'phone': claim.phone,
        'email': claim.email,
        'state': claim.state,
        'company_name': claim.company_name,
        'estimated_shares': claim.estimated_shares,
        'estimated_value': claim.estimated_value,
        'service_tier': claim.service_tier,
        'status': 'Submitted',
        'created_at': datetime.now(timezone.utc),
        'updated_at': datetime.now(timezone.utc)
    }
    result = await db.claims.insert_one(claim_doc)
    claim_id = str(result.inserted_id)
    
    return ClaimResponse(
        id=claim_id,
        user_id=user['_id'],
        asset_type=claim.asset_type,
        claiming_for=claim.claiming_for,
        documents=claim.documents,
        full_name=claim.full_name,
        phone=claim.phone,
        email=claim.email,
        state=claim.state,
        company_name=claim.company_name,
        estimated_shares=claim.estimated_shares,
        estimated_value=claim.estimated_value,
        service_tier=claim.service_tier,
        status='Submitted',
        created_at=claim_doc['created_at'].isoformat(),
        updated_at=claim_doc['updated_at'].isoformat()
    )

@api_router.get('/claims')
async def get_user_claims(request: Request):
    user = await get_current_user(request)
    claims_cursor = db.claims.find({'user_id': user['_id']})
    claims = []
    async for claim in claims_cursor:
        claim['id'] = str(claim['_id'])
        claim.pop('_id', None)
        if isinstance(claim.get('created_at'), datetime):
            claim['created_at'] = claim['created_at'].isoformat()
        if isinstance(claim.get('updated_at'), datetime):
            claim['updated_at'] = claim['updated_at'].isoformat()
        claims.append(claim)
    return claims

# ============ ADMIN ROUTES ============

@api_router.get('/admin/claims')
async def get_all_claims(request: Request):
    user = await get_current_user(request)
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    
    # Fetch all claims with user information
    claims_cursor = db.claims.find({})
    claims = []
    
    async for claim in claims_cursor:
        user_id_str = claim.get('user_id')
        claim_obj = {
            'id': str(claim['_id']),
            'user_id': user_id_str,
            'asset_type': claim.get('asset_type'),
            'claiming_for': claim.get('claiming_for'),
            'documents': claim.get('documents', []),
            'full_name': claim.get('full_name'),
            'phone': claim.get('phone'),
            'email': claim.get('email'),
            'state': claim.get('state'),
            'company_name': claim.get('company_name'),
            'estimated_shares': claim.get('estimated_shares'),
            'estimated_value': claim.get('estimated_value'),
            'service_tier': claim.get('service_tier'),
            'status': claim.get('status'),
            'created_at': claim.get('created_at'),
            'updated_at': claim.get('updated_at')
        }
        
        if user_id_str:
            user = await db.users.find_one({'_id': ObjectId(user_id_str)}, {'_id': 0, 'email': 1, 'full_name': 1})
            if user:
                claim_obj['user_email'] = user.get('email', '')
                claim_obj['user_full_name'] = user.get('full_name', '')
        
        claims.append(claim_obj)
    
    # Sort by created_at
    claims.sort(key=lambda x: x.get('created_at') or datetime.min, reverse=True)
    for claim in claims:
        if isinstance(claim.get('created_at'), datetime):
            claim['created_at'] = claim['created_at'].isoformat()
        if isinstance(claim.get('updated_at'), datetime):
            claim['updated_at'] = claim['updated_at'].isoformat()
    return claims

@api_router.patch('/admin/claims/{claim_id}/status')
async def update_claim_status(claim_id: str, update: ClaimStatusUpdate, request: Request):
    user = await get_current_user(request)
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    
    try:
        obj_id = ObjectId(claim_id)
    except:
        raise HTTPException(status_code=400, detail='Invalid claim ID')
    
    claim = await db.claims.find_one({'_id': obj_id})
    if not claim:
        raise HTTPException(status_code=404, detail='Claim not found')
    
    await db.claims.update_one(
        {'_id': obj_id},
        {'$set': {'status': update.status, 'updated_at': datetime.now(timezone.utc)}}
    )
    
    return {'message': 'Claim status updated successfully', 'status': update.status}

# ============ MAIN APP ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get('FRONTEND_URL', 'http://localhost:3000')],
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()
