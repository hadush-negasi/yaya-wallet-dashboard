const BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export async function fetchTransactions(page = 1) {
  const res = await fetch(`${BASE}/transactions?p=${page}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function searchTransactions(query, page = 1) {
  const res = await fetch(`${BASE}/transactions/search?p=${page}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// fetch the current user from backend, for now the backend has hardcoded the current account in the .env file
export async function fetchCurrentAccount() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/transactions/me`);
    if (!res.ok) throw new Error("Failed to fetch account name");
    const data = await res.json();
    return data.accountName;
  } catch (err) {
    console.error(err);
    return null;
  }
}

