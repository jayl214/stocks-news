import React from 'react';

const TIME_RANGE_OPTIONS = [
  {
    timeRange: "1m",
    label: "1 Month"
  },
  {
    timeRange: "6m",
    label: "6 Months"
  },
  {
    timeRange: "1y",
    label: "1 Year"
  },
  {
    timeRange: "5y",
    label: "5 Years"
  },
]

const TimeRangeButtons = ({
  timeRange,
  onSelectTimeRange,
}) => {
  const _onClickTimeRangeButton = (event = {}) => {
    const timeRange = event.target?.getAttribute?.("timeRange");
    onSelectTimeRange(timeRange);
  }
  return (
    <div className="btn-group-timeRange">
      {TIME_RANGE_OPTIONS.map((timeRangeOption = {}) => 
        <button
          className={`btn btn-timeRange-6m ${timeRangeOption.timeRange === timeRange ? 'btn-active' : ''}`}
          timeRange={timeRangeOption.timeRange}
          onClick={_onClickTimeRangeButton}
        >
          {timeRangeOption.label}
        </button>
      )}
    </div>
  );
}

export default TimeRangeButtons;