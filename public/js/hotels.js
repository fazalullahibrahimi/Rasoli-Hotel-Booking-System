let isAdmin = false;

async function fetchHotels() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  isAdmin = localStorage.getItem('role') === 'admin';

  try {
    const response = await fetch('/api/hotels', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const hotels = await response.json();
      const hotelsList = document.getElementById('hotelsList');
      hotelsList.innerHTML = '';

      hotels.forEach((hotel) => {
        const hotelElement = document.createElement('div');
        hotelElement.className = 'bg-white p-4 rounded shadow mb-4';
        hotelElement.innerHTML = `
                    <h2 class="text-xl font-bold">${hotel.name}</h2>
                    <p>Location: ${hotel.location}</p>
                    <p>Price per night: $${hotel.pricePerNight}</p>
                    <p>Rooms available: ${hotel.roomsAvailable}</p>
                    ${
                      isAdmin
                        ? `
                        <button onclick="editHotel('${hotel._id}')" class="mt-2 bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                        <button onclick="deleteHotel('${hotel._id}')" class="mt-2 bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button>
                    `
                        : ''
                    }
                    <button onclick="bookHotel('${
                      hotel._id
                    }')" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
                `;
        hotelsList.appendChild(hotelElement);
      });

      if (isAdmin) {
        const addHotelButton = document.createElement('button');
        addHotelButton.textContent = 'Add New Hotel';
        addHotelButton.className =
          'mt-4 bg-green-500 text-white px-4 py-2 rounded';
        addHotelButton.onclick = addHotel;
        hotelsList.appendChild(addHotelButton);
      }
    } else {
      throw new Error('Failed to fetch hotels');
    }
  } catch (error) {
    alert('An error occurred while fetching hotels.');
  }
}

async function bookHotel(hotelId) {
  const checkInDate = prompt('Enter check-in date (YYYY-MM-DD):');
  const checkOutDate = prompt('Enter check-out date (YYYY-MM-DD):');

  if (!checkInDate || !checkOutDate) return;

  const token = localStorage.getItem('token');

  try {
    if (token) {
      const response = await fetch(`/api/bookings/${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checkInDate, checkOutDate }),
      });

      if (response.ok) {
        alert('Booking successful!');
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.error}`);
      }
    } else {
      // Guest booking
      const guestBookings = JSON.parse(
        localStorage.getItem('guestBookings') || '[]'
      );
      const newBooking = {
        _id: Date.now().toString(), // Use timestamp as a simple unique ID
        hotelId: { _id: hotelId, name: 'Hotel Name Not Available' }, // We don't have the hotel name for guests
        checkInDate,
        checkOutDate,
        totalPrice: 0, // We don't have the price information for guests
      };
      guestBookings.push(newBooking);
      localStorage.setItem('guestBookings', JSON.stringify(guestBookings));
      alert('Guest booking successful! Please log in to manage your bookings.');
    }
  } catch (error) {
    alert('An error occurred during booking.');
  }
}

async function addHotel() {
  if (!isAdmin) {
    alert('You do not have permission to add hotels.');
    return;
  }

  const name = prompt('Enter hotel name:');
  const location = prompt('Enter hotel location:');
  const roomsAvailable = prompt('Enter number of rooms available:');
  const pricePerNight = prompt('Enter price per night:');

  if (!name || !location || !roomsAvailable || !pricePerNight) return;

  try {
    const response = await fetch('/api/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, location, roomsAvailable, pricePerNight }),
    });

    if (response.ok) {
      alert('Hotel added successfully!');
      fetchHotels(); // Refresh the hotel list
    } else {
      const error = await response.json();
      alert(`Failed to add hotel: ${error.error}`);
    }
  } catch (error) {
    alert('An error occurred while adding the hotel.');
  }
}

async function editHotel(hotelId) {
  if (!isAdmin) {
    alert('You do not have permission to edit hotels.');
    return;
  }

  const name = prompt('Enter new hotel name:');
  const location = prompt('Enter new hotel location:');
  const roomsAvailable = prompt('Enter new number of rooms available:');
  const pricePerNight = prompt('Enter new price per night:');

  if (!name || !location || !roomsAvailable || !pricePerNight) return;

  try {
    const response = await fetch(`/api/hotels/${hotelId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, location, roomsAvailable, pricePerNight }),
    });

    if (response.ok) {
      alert('Hotel updated successfully!');
      fetchHotels(); // Refresh the hotel list
    } else {
      const error = await response.json();
      alert(`Failed to update hotel: ${error.error}`);
    }
  } catch (error) {
    alert('An error occurred while updating the hotel.');
  }
}

async function deleteHotel(hotelId) {
  if (!isAdmin) {
    alert('You do not have permission to delete hotels.');
    return;
  }

  if (!confirm('Are you sure you want to delete this hotel?')) return;

  try {
    const response = await fetch(`/api/hotels/${hotelId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      alert('Hotel deleted successfully!');
      fetchHotels(); // Refresh the hotel list
    } else {
      const error = await response.json();
      alert(`Failed to delete hotel: ${error.error}`);
    }
  } catch (error) {
    alert('An error occurred while deleting the hotel.');
  }
}

fetchHotels();

console.log('Hotels JavaScript file updated.');
