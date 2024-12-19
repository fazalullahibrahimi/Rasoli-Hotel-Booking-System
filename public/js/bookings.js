let isAdmin = false;

async function fetchBookings() {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  isAdmin = localStorage.getItem('role') === 'admin';

  const guestMessage = document.getElementById('guestMessage');
  guestMessage.style.display = isLoggedIn ? 'none' : 'block';

  const bookingsList = document.getElementById('bookingsList');
  bookingsList.innerHTML = '';

  try {
    let bookings;
    if (isLoggedIn) {
      const endpoint = isAdmin ? '/api/bookings/all' : '/api/bookings/user';
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      bookings = await response.json();
    } else {
      // Guest bookings from localStorage
      bookings = JSON.parse(localStorage.getItem('guestBookings') || '[]');
    }

    if (bookings.length === 0) {
      bookingsList.innerHTML = '<p class="text-center">No bookings found.</p>';
      return;
    }

    bookings.forEach((booking) => {
      const bookingElement = document.createElement('div');
      bookingElement.className = 'bg-white p-4 rounded shadow mb-4';
      bookingElement.innerHTML = `
                <h2 class="text-xl font-bold">${
                  booking.hotelId?.name || 'Hotel Name Not Available'
                }</h2>
                ${
                  isAdmin
                    ? `<p>User: ${booking.userId?.username || 'Guest'}</p>`
                    : ''
                }
                <p>Check-in: ${new Date(
                  booking.checkInDate
                ).toLocaleDateString()}</p>
                <p>Check-out: ${new Date(
                  booking.checkOutDate
                ).toLocaleDateString()}</p>
                <p>Total Price: $${booking.totalPrice || 'N/A'}</p>
                <button onclick="cancelBooking('${
                  booking._id
                }')" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">Cancel Booking</button>
            `;
      bookingsList.appendChild(bookingElement);
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    bookingsList.innerHTML =
      '<p class="text-center text-red-500">An error occurred while fetching bookings.</p>';
  }
}

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  try {
    if (isLoggedIn) {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel booking');
      }
    } else {
      // Cancel guest booking from localStorage
      let guestBookings = JSON.parse(
        localStorage.getItem('guestBookings') || '[]'
      );
      guestBookings = guestBookings.filter(
        (booking) => booking._id !== bookingId
      );
      localStorage.setItem('guestBookings', JSON.stringify(guestBookings));
    }

    alert('Booking cancelled successfully!');
    fetchBookings(); // Refresh the bookings list
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert(`Cancellation failed: ${error.message}`);
  }
}

// Call fetchBookings when the page loads
document.addEventListener('DOMContentLoaded', fetchBookings);
