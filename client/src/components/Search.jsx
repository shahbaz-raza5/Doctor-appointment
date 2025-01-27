import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'; 
import PropTypes from 'prop-types';

const Search = ({ moduleType, onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchOption, setSearchOption] = useState('');

  const handleSearch = () => {
    onSearch(query, searchOption);
  };

  const renderOptions = () => {
    switch (moduleType) {
      case 'patient':
        return (
          <>
            <option value="doctorName">by Doctor Name</option>
            <option value="specialization">by Specialization</option>
          </>
        );
      case 'doctor':
        return (
          <>
            <option value="patientID">by Patient ID</option>
            <option value="patientName">by Patient Name</option>
          </>
        );
      case 'admin':
        return (
          <>
            <option value="patientName">by Patient Name</option>
            <option value="patientID">by Patient ID</option>
            <option value="doctorName">by Doctor Name</option>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="search-component p-4 max-w-lg mx-auto rounded-lg">
      <div className="flex items-center space-x-2 ">
        <select
          className="md:w-60 w-28 p-2 rounded-lg flex-grow bg-transparent border border-blue-300 text-slate-50"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="" disabled>Select Option</option>
          {renderOptions()}
        </select>
        <input
          type="text"
          className="p-2 rounded-lg flex-grow bg-transparent border border-blue-300 text-slate-50 placeholder-custom"
          placeholder="Enter query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="text-white p-2 rounded-lg flex-shrink-0 bg-blue-500 hover:bg-blue-600"
        >
          <AiOutlineSearch size={30} />
        </button>
      </div>
      <style jsx>{`
        .placeholder-custom::placeholder {
          color: #f8fafc; /* Change this color to your desired placeholder color */
        }
      `}</style>
    </div>
  );
};

Search.propTypes = {
  moduleType: PropTypes.oneOf(['patient', 'doctor', 'admin']).isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default Search;
