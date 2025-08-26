import Badge from "./Badge";

export default function TransactionTable({ data, currentAccount}) {

  // method to identify if the transaction is incoming or outgoing
  const isIncoming = (transaction) => {
    if (transaction.sender.account === transaction.receiver.account){
      return true; // top-up
    }
    // incoming 
    if(transaction.receiver.account === currentAccount){
      return true;
    }
    else{ return false; } 
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-3 py-2 text-left">Transaction ID</th>
            <th className="px-3 py-2 text-left">Sender</th>
            <th className="px-3 py-2 text-left">Receiver</th>
            <th className="px-3 py-2 text-left">Amount</th>
            <th className="px-3 py-2 text-left">Currency</th>
            <th className="px-3 py-2 text-left">Cause</th>
            <th className="px-3 py-2 text-left">Created At</th>
            <th className="px-3 py-2 text-left">Dir</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono">{transaction.id}</td>
              <td className="px-3 py-2">{transaction.sender.name}</td>
              <td className="px-3 py-2">{transaction.receiver.name}</td>
              <td className="px-3 py-2">{transaction.amount.toLocaleString()}</td>
              <td className="px-3 py-2">{transaction.currency}</td>
              <td className="px-3 py-2">{transaction.cause || '-'}</td>
              <td className="px-3 py-2">{new Date(transaction.created_at_time * 1000).toLocaleString()}</td>
              <td className="px-3 py-2">
                <Badge kind={isIncoming(transaction) ? "in" : "out"}>
                  {isIncoming(transaction) ? "Incoming" : "Outgoing"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
