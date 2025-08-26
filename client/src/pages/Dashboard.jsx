import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTransactions, searchTransactions, fetchCurrentAccount } from "../lib/api";
import TransactionTable from "../components/TransactionTable";
import Pagination from "../components/Pagination";

export default function Dashboard() {
  const [currentAccount, setCurrentAccount] = useState(""); // store the current account 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // to show loading spinner
  const [error, setError] = useState(null);  // to show error
  const [lastPage, setLastPage] = useState(1); // store the last page returned from backend api
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(""); // Local state for search input
  
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("p") || "1");
  const isSearchMode = !!query; // check if the query has value and convert it to boolean

  // Load current account on mount
  useEffect(() => {
    fetchCurrentAccount().then(setCurrentAccount);
  }, []);

  // Load transactions when page or query changes
  useEffect(() => {
    if (isSearchMode) {
      loadSearchTransactions();
    } else {
      loadTransactions();
    }
  }, [isSearchMode, loadSearchTransactions, loadTransactions]);

  // Load normal transactions
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(page);
      setTransactions(data.data || []);
      setLastPage(data.lastPage || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Load search results
  const loadSearchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchTransactions(query, page);
      setTransactions(data.data || []);
      setLastPage(data.lastPage || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  // Handle search button click
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      handleClearSearch();
      return;
    }
    
    setSearchParams({ q: searchInput.trim(), p: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput(""); // clear the search bar input
    setSearchParams({ p: 1 }); // show p=1 as if page=1 in the url bar to show user which page is being fetched
  };

  const handlePageChange = (newPage) => {
    if (isSearchMode) {
      setSearchParams({ q: query, p: newPage });
    } else {
      setSearchParams({ p: newPage });
    }
  };


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">YaYa Wallet Transactions</h1>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by sender, receiver, cause or ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {isSearchMode && (
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded"
            onClick={handleClearSearch}
            disabled={loading}
          >
            Clear
          </button>
        )}
      </div>

      {isSearchMode && (
        <div className="text-sm text-gray-600">
          Showing results for: "{query}"
        </div>
      )}

      {loading && <div className="text-gray-500">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <TransactionTable data={transactions} currentAccount={currentAccount}/>
          <Pagination
            currentPage={page}
            lastPage={lastPage}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </>
      )}

      {!loading && !error && transactions.length === 0 && isSearchMode && (
        <div className="text-gray-500">No transactions found for "{query}"</div>
      )}

      {!loading && !error && transactions.length === 0 && !isSearchMode && (
        <div className="text-gray-500">No transactions found</div>
      )}
    </div>
  );
}