import React, { useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  onChange,
  containerRef,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  // Set initial date to today to ensure calendar opens at current month
  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={popupRef}
      className="absolute z-50 bg-white rounded-2xl shadow-2xl w-[850px] border border-gray-200"
      style={{
        top: 'calc(100% + 12px)',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      {/* Header */}
      <div className="px-8 py-4 border-b">
        <div>
          <h2 className="text-base font-semibold">Select dates</h2>
          <p className="text-gray-500 text-sm">Add your travel dates for exact pricing</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-6 py-4">
        <DatePicker
          selected={startDate || today}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          monthsShown={2}
          minDate={today}
          calendarClassName="custom-calendar"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            const isFirstCalendar = date.getMonth() === today.getMonth();
            
            return (
              <div className="flex items-center justify-between px-2 py-2">
                {isFirstCalendar && (
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left text-xs"></i>
                  </button>
                )}
                {!isFirstCalendar && <div className="w-10" />}
                
                <h3 className="font-medium">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                
                {isFirstCalendar && (
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                  </button>
                )}
                {!isFirstCalendar && <div className="w-10" />}
              </div>
            );
          }}
          renderMonthContent={(month, shortMonth) => {
            // Force the second calendar to show the next month
            const isFirstCalendar = month === new Date().getMonth();
            if (!isFirstCalendar) {
              const nextMonth = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              return nextMonth.toLocaleString('default', { month: 'long' });
            }
            return shortMonth;
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t flex items-center justify-between">
        <button
          onClick={() => {
            onChange([null, null]);
            onClose();
          }}
          className="text-gray-900 text-sm font-medium hover:underline"
        >
          Clear dates
        </button>
        <button
          onClick={onClose}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker; 