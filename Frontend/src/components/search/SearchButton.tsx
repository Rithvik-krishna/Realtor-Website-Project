import React from 'react';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
  text?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  isLoading = false,
  onClick,
  text = 'Search'
}) => {
  return (
    <>
      <style>{`
        .search-action-submit-btn {
          height: 48px;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          border: none;
          border-radius: 40px;
          color: #ffffff;
          padding: 0 28px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
          outline: none;
          user-select: none;
          flex-shrink: 0;
        }
        .search-action-submit-btn:hover:not(:disabled), .search-action-submit-btn:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
        }
        .search-action-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .search-action-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .search-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: search-spin 0.8s linear infinite;
        }
        @keyframes search-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <button
        type="submit"
        className="search-action-submit-btn"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="search-spinner" />
        ) : (
          <Search size={16} />
        )}
        <span>{isLoading ? 'Searching...' : text}</span>
      </button>
    </>
  );
};
