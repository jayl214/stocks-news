import React from 'react';


const Suggestion = ({
  name,
  symbol,
  onSelectTargetCompany = () => {}
}) => {
  return (
    <div
      className="searchbar-suggestion"
      ticker={symbol}
      name={name}
      onMouseDown={onSelectTargetCompany}
    >
      {name} ({symbol})
    </div>
  );
}

export default Suggestion;