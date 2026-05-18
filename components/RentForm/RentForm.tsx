'use client';

import { useState, useRef, useEffect } from 'react';
import { rentCar } from '@/lib/api';
import styles from './RentForm.module.css';

export default function RentForm({ carId }: { carId: string }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bookingDate: '',
    comment: '',
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  const [currentViewDate, setCurrentViewDate] = useState(new Date()); 
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await rentCar({ ...form, carId });
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const monthsNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    let firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysArray = [];

    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      daysArray.push({
        day: prevMonthDays - i + 1,
        isCurrentMonth: false,
        dateString: ''
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      const monthStr = (viewMonth + 1) < 10 ? `0${viewMonth + 1}` : `${viewMonth + 1}`;
      daysArray.push({
        day: i,
        isCurrentMonth: true,
        dateString: `${dayStr}.${monthStr}.${viewYear}`
      });
    }

    const totalSlots = 42;
    const nextDaysNeeded = totalSlots - daysArray.length;
    for (let i = 1; i <= nextDaysNeeded; i++) {
      daysArray.push({
        day: i,
        isCurrentMonth: false,
        dateString: ''
      });
    }

    return daysArray;
  };

  const handleDayClick = (dateString: string) => {
    if (!dateString) return;
    setForm({ ...form, bookingDate: dateString });
    setIsOpen(false);
  };

  if (success) {
    return (
      <div className={styles.success}>
        🎉 Your booking was successful! We will contact you soon.
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Book your car now</h2>
      <p>Stay connected! We are always ready to help you.</p>

      <input
        required
        placeholder="Name*"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        required
        type="email"
        placeholder="Email*"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      
      <div className={styles.dateFieldWrapper} ref={calendarRef}>
        <input
          required
          readOnly
          placeholder="Booking date"
          value={form.bookingDate} 
          onClick={() => setIsOpen(!isOpen)}
          className={styles.dateInput}
        />
        
        {isOpen && (
          <div className={styles.calendarPopup}>
            <div className={styles.calendarArrow}></div>
            
            <div className={styles.calendarHeader}>
              <button type="button" onClick={handlePrevMonth} className={styles.navBtn}>
                <svg width="14" height="24" viewBox="0 0 14 24" fill="none"><path d="M12 22L2 12L12 2" stroke="#3470FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className={styles.currentMonthTitle}>
                {monthsNames[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={handleNextMonth} className={styles.navBtn}>
                <svg width="14" height="24" viewBox="0 0 14 24" fill="none"><path d="M2 2L12 12L2 22" stroke="#3470FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <div className={styles.weekDaysGrid}>
              {daysOfWeek.map((day) => (
                <div key={day} className={styles.weekDayName}>{day}</div>
              ))}
            </div>

            <div className={styles.daysGrid}>
              {generateCalendarDays().map((item, index) => (
                <div
                  key={index}
                  onClick={() => item.isCurrentMonth && handleDayClick(item.dateString)}
                  className={`
                    ${styles.calendarDay} 
                    ${!item.isCurrentMonth ? styles.otherMonthDay : ''} 
                    ${item.isCurrentMonth && form.bookingDate === item.dateString ? styles.selectedDay : ''}
                  `}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <textarea
        placeholder="Comment"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}