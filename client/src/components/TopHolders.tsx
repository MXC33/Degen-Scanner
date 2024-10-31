import React from "react";
import "./styles/TopHolders.css";

interface TopHolder {
  rank: number;
  owner: string;
  amount: number;
  percentage: string;
}

interface TopHoldersProps {
  topHolders: TopHolder[];
}

const TopHolders: React.FC<TopHoldersProps> = ({ topHolders }) => {
  return (
    <div className="top-holders-container">
      <h2>Top 10 Holders</h2>
      <table className="top-holders-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Owner Address</th>
            <th>Amount Held</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {topHolders.map((holder) => (
            <tr key={holder.rank}>
              <td>{holder.rank}</td>
              <td className="owner-address">
                {holder.owner.slice(0, 6)}...{holder.owner.slice(-4)}
              </td>
              <td>{holder.amount}</td>
              <td>{holder.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopHolders;
