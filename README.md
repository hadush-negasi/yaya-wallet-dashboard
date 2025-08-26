# YaYa Wallet Transactions Dashboard

This is a full-stack dashboard application for monitoring YaYa Wallet transactions. 
The **backend (NestJS)** securely communicates with YaYa Wallet’s REST API using HMAC-based authentication.
The **frontend (React.js + Tailwind)** displays a paginated, searchable table of transactions with incoming/outgoing indicators.
## 🚀 Features
- Fetches transactions from the YaYa Wallet REST API (via NestJS backend proxy).
- Displays a tabular list with:
  - Transaction ID
  - Sender
  - Receiver
  - Amount
  - Currency
  - Cause
  - Created At
- Pagination (`?p=` query parameter support).
- Search by sender, receiver, cause, or transaction ID.
- Incoming/outgoing transactions highlighted visually:
  - **Green** → Incoming
  - **Red** → Outgoing
  - **Top-up** transactions (sender == receiver) treated as incoming.
- Responsive UI using Tailwind CSS.

---

## 🛠 Tech Stack
- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework)
  - Handles API integration
  - HMAC signing for security (per YaYa Wallet spec)
  - Environment variable config (`.env`)
- **Frontend**: [Create React App](https://create-react-app.dev/) + Tailwind CSS
  - Simple dashboard UI
  - React hooks for state management
  - Axios for API calls

---
# Implementation

## Backend

### 1. Project Setup

#### 1.1 Created a NestJS project to securely handle API communication and signing:

```bash
# Prereqs: Node 18+, npm 9+, Nest CLI
npm i -g @nestjs/cli

nest new backend
```
#### 1.2 Installed required dependencies:

```bash
npm install @nestjs/axios @nestjs/config class-validator class-transformer helmet
```
#### Project Structure
```
backend/
├── src/
│   ├── common/                       # Shared utilities and services
│   │   ├── time-offset.service.ts    # Handles server time offset with YAYA API
│   │   └── yaya-auth.util.ts         # Signing utility for authenticated requests
│   │
│   ├── transactions/                 # Transaction module (API integration)
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   └── search.dto.ts         # DTO for transaction search
│   │   ├── transactions.controller.ts # Defines endpoints for transactions
│   │   ├── transactions.module.ts     # Module wiring
│   │   └── transactions.service.ts    # Core logic for API calls & signing
│   │
│   ├── app.module.ts                 # Root application module
│   └── main.ts                       # Application entrypoint
│
├── .env                              # Environment variables (ignored in git)
├── package.json                      # Project dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

#### 1.3 Set up .env to store sensitive information: 
```bash
YAYA_API_BASE=https://sandbox.yayawallet.com    # base url
YAYA_API_KEY=key-test_...                       # API KEY from YAYA Wallet
YAYA_API_SECRET=eyJ0eXAiOiJKV...                # API SECRET from YAYA Wallet
CURRENT_ACCOUNT_NAME=optional                   # The account name currently being used todetermine incoming/outgoing  transactions
PORT=3001                                       # PORT NestJs app runs
```
**DoNot  commit .env file to github repo**
**This ensures API keys are not hardcoded and can be safely rotated if needed.**

### 2. Transactions Module
Created a transactions module to encapsulate all transaction-related logic.
```bash
nest generate module transactions
```
#### 2.1 Transactions Controller
created transactions controller which exposes endpoints for frontend consumption.
```bash
nest generate controller transactions
```
The TransactionsController is responsible for handling incoming HTTP requests related to transactions and mapping them to the appropriate service methods. It exposes three main endpoints:
```
GET /transactions
Accepts an optional query parameter p (page number).
Calls the service method getByUser() to fetch transactions for the currently authenticated user.
Returns a paginated response including both the page number and the transaction data.

POST /transactions/search

Accepts a request body containing the search query and optional paramenter p (page number).
Calls the service method search() to query the Yaya Wallet API for transactions matching the search term.
Returns a paginated response with the results.

GET /transactions/me
A simple endpoint to retrieve the account name of the current user, for now it is declared in the .env file under the CURRENT_ACCOUNT_NAME.
```

#### 2.2 Transactions Service
The TransactionsService is responsible for handling communication with the Yayawalet transaction API.
```bash
nest generate service transactions
```
#### 2.3 Search Transactions Dto - defines shape of search request body.
manually create the dto folder inside the transactions/ 

### 3. Backend Service Logic
TransactionsService is the core
#### 3.1 Configuration & Secrets
Pulls API base URL, key, secret, and optional current account name from .env using ConfigService

#### 3.2 Request Signing
Uses YaYa Wallet’s HMAC-based authentication:
Concatenate {timestamp + method + endpoint + body}
Hash with SHA256 HMAC using API_SECRET
Base64 encode → YAYA-API-SIGN header
**Signing code**
```bash
export function signRequest(params) {
    const { secret, method, endpoint, body, timestamp } = params;
    const bodyString = body ? JSON.stringify(body) : '';
    const prehash = `${timestamp}${method}${endpoint}${bodyString}`; # concatenate
    const hmac = crypto.createHmac('sha256', secret); # SHA256 hashing
    hmac.update(prehash);
    const signature = hmac.digest('base64'); 
    return signature;
}
```

Only the endpoint path is signed, not full URL, query parameters are appended afterward (?p=1).

```bash
const endpoint = '/api/en/transaction/find-by-user';
const url = `${this.base}${endpoint}?p=${page}`;
this.http.get(url, { headers: this.headers('GET', endpoint) });
```
#### 3.3 Headers Setup
Each request includes:
```bash
{
  'Content-Type': 'application/json',
  'YAYA-API-KEY': API_KEY,
  'YAYA-API-TIMESTAMP': timestamp,
  'YAYA-API-SIGN': signature
}
```

#### 3.4 Service Methods
```
getByUser(page = 1) – fetches paginated transactions for the current account.

search(query: string, page = 1) – searches transactions by sender, receiver, cause, or ID.

getCurrentAccountName() – optional helper for frontend to determine incoming/outgoing transactions.
```

#### 3.5 Time Offset Handling

TimeOffsetService ensures that YAYA-API-TIMESTAMP is synchronized with YaYa Wallet server time to prevent request expiry. i have used the time endpoint to query API server time.
```bash
 # get the server time from this and save it as serverMs
const res = await firstValueFrom(this.http.get(`${baseUrl}/api/en/time`));
const serverMs = Number(res.data?.time); # Extract server time from object response
const localMs = Date.now();
this.offsetMs = serverMs - localMs;

```
### 4. Security Considerations
```
API keys are kept secret in .env.

Requests are signed, and sensitive data is never exposed to the frontend.

Endpoints are hardcoded, which is safe because they are public API paths.

Helmet middleware can be added for HTTP security headers.
```

## FrontEnd

### Project Setup

#### Create react app using the CRA template and install dependencies
```bash
# Create React application
npx create-react-app yaya-wallet-frontend
cd yaya-wallet-frontend

# Install required dependencies
npm install react-router-dom
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```
#### Project Structure
```
src/
├── components/
│   ├── Badge.js
│   ├── TransactionTable.js
│   └── Pagination.js
├── pages/
│   └── Dashboard.js
├── lib/
│   └── api.js
├── App.js
└── index.js
```
#### Environment Configuration
Created .env file with environment variables:
```bash
REACT_APP_API_BASE=http://localhost:3001 # Backend api to make requests
```
#### Core Components Implementation
API Service Layer (lib/api.js)
```
// Implemented API functions for:
// - fetchTransactions(page)
// - searchTransactions(query, page)
// - fetchCurrentAccount()
```

Reusable UI Components
```
Badge.js: Direction indicator (Incoming/Outgoing) with colored styling

Pagination.js: Page navigation controls with disabled states

TransactionTable.js: Main data table with transaction information
```
---
#### Dashboard Page (pages/Dashboard.js)
Key Features Implemented
```
Transaction Loading: Fetches paginated transactions from API

Search Functionality: Real-time search with query parameters

URL Synchronization: URL reflects current state (page, search query)

Responsive Design: Mobile-friendly layout with Tailwind CSS

Error Handling: Comprehensive error states and user feedback
```
Search Implementation
```
Dedicated search input with enter key support

Search button trigger (not on-type to reduce API calls)

Clear search functionality

URL updates to /search?q=query&p=page
```
Pagination System
```
Dynamic page calculation from API response, like res.data.lastPage

Next/previous navigation

URL parameter synchronization

Disabled states during loading
```
---
#### Transaction Table Component
Data Display
```
Transaction ID with monospace font, 
Sender and receiver information,
Amount formatting with locale-specific number formatting,
Currency display,
Cause/purpose field
Human-readable timestamp conversion
Direction badges (Incoming/Outgoing)
```
#### URL Management
Implemented React Router's:
```
useSearchParams() for query parameter management

useNavigate() for programmatic navigation

Route-based URL structure (/transactions, /search)
```
# How to Run/test code locally



## 📂 Project Structure
root/
├── backend/ # NestJS server
│ ├── src/
│ ├── test/
│ └── ...
├── frontend/ # React (CRA) client
│ ├── src/
│ ├── public/
│ └── ...
└── README.md # this file

---


---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/yaya-wallet-dashboard.git
cd yaya-wallet-dashboard

```
### 2. Backend(NestJs)
```bash
cd backend
npm install
cp .env.example .env   # Add API credentials & base URL here
npm run start:dev
```
### 3. FrontEnd(React)
```bash
cd ../frontend
npm install
npm start
```
Backend (NestJS) — Implementation & Testing Guide

Stack: NestJS, @nestjs/axios (HTTP client), @nestjs/config (env), Helmet (security), class-validator / class-transformer (DTO validation)
Goal: Expose a secure proxy API that signs requests to YaYa Wallet’s REST API using HMAC per their spec, so the frontend never sees API credentials.

1) Create the NestJS project
# Prereqs: Node 18+, npm 9+, Nest CLI
npm i -g @nestjs/cli

# Create project
nest new backend
cd backend
1.1 Install dependencies
npm i @nestjs/axios @nestjs/config helmet
npm i class-validator class-transformer







