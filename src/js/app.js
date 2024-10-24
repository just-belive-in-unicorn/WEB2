
import { validateUser, sortUsers, searchInArray, filterUsers,  transformUsers, transformUsersAdd} from '/js/test-module.js';

let users = [];
let tableUsers = [];
let usersNow = [];
const teachersContainer = document.getElementById('teachers-container');
const infoPopup = document.getElementById('info-popup');
const closePopupBtn = document.querySelector('.close-info');

fetch('http://localhost:3001/api/users') 
    .then(response => response.json())
    .then(users => {
        initializeUsers();
    })
    .catch(error => console.error('Error fetching users:', error));

    async function fetchUsers() {
        try {
          const response = await fetch(`https://randomuser.me/api/?results=50`);
          const data = await response.json();
          return data.results;
        } catch (error) {
          console.error('Error fetching users:', error);
          return [];
        }
      }

      async function initializeUsers() {
        let usersZapit = await fetchUsers();
        let usersPrev = transformUsers(usersZapit);
        users = transformUsersAdd(usersPrev);
        usersNow = users;
        displayTeachers();
        displayFavorites();
    }
    
      

function populateInfoPopup(teacher) {
    document.getElementById('favorite-icon').src = teacher.favorite ? 'favorite.png' : 'not-favorite.png';
    document.getElementById('teacher-photo').src = teacher.picture_large;
    document.getElementById('teacher-name').textContent = teacher.full_name;
    document.getElementById('teacher-subject').textContent = teacher.course;
    document.getElementById('teacher-place').textContent = `${teacher.city}, ${teacher.country}`;
    document.getElementById('teacher-bio').textContent = `${teacher.age}, ${teacher.gender}`;
    document.getElementById('teacher-email').href = `mailto:${teacher.email}`;
    document.getElementById('teacher-email').textContent = teacher.email;
    document.getElementById('teacher-phone').textContent = teacher.phone;
    document.getElementById('teacher-note').textContent = teacher.note || 'No additional information available.';
}

function openInfoPopup(teacher, teacherCard) {
    populateInfoPopup(teacher);
    infoPopup.style.display = 'block';

    const favoriteIcon = document.getElementById('favorite-icon');
    favoriteIcon.onclick = () => {
        displayFavorites();
        teacher.favorite = !teacher.favorite; // Toggle favorite status
        favoriteIcon.src = teacher.favorite ? 'favorite.png' : 'not-favorite.png'; // Update icon

        if (teacher.favorite) {
            const ribbon = document.createElement('img');
            ribbon.src = 'favorite.png';
            ribbon.alt = 'Ribbon';
            ribbon.classList.add('ribbon');
            teacherCard.appendChild(ribbon);
        } else {
            const existingRibbon = teacherCard.querySelector('.ribbon');
            if (existingRibbon) {
                teacherCard.removeChild(existingRibbon);
            }
        }
        currentFavoritePage=1;
        displayTeachers();
        displayFavorites();
    };
}




let currentPage = 1;
const usersPerPage = 10;


function displayTeachers() {
    teachersContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const teachersToShow = usersNow.slice(startIndex, endIndex);
    tableUsers = teachersToShow;
    updateTable();

    teachersToShow.forEach(teacher => {
        const teacherCard = document.createElement('div');
        teacherCard.classList.add('top-card');
        const profileImage = teacher.picture_large 
            ? `<img src="${teacher.picture_large}" alt="Profile Image" class="profile-img">`
            : `<div class="profile-img">${teacher.full_name.charAt(0).toUpperCase()}</div>`;
        
        teacherCard.innerHTML = `
            ${teacher.favorite ? '<img src="favorite.png" alt="Ribbon" class="ribbon">' : ''}
            ${profileImage}
            <div class="name">${teacher.full_name}</div>
            <div class="subject">${teacher.course}</div>
            <div class="location">${teacher.city}, ${teacher.country}</div>
        `;

        teacherCard.addEventListener('click', () => {
            openInfoPopup(teacher, teacherCard);
        });

        teachersContainer.appendChild(teacherCard);
    });

    
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const nextButton = document.getElementById('next-50');
    const prevButton = document.getElementById('prev-50');
    if (currentPage * usersPerPage >= usersNow.length) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
}

document.getElementById('next-50').addEventListener('click', () => {
    if (currentPage * usersPerPage < usersNow.length) {
        currentPage++;
        displayTeachers();
    }
});

document.getElementById('prev-50').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayTeachers();
    }
});



document.getElementById('next-50').addEventListener('click', () => {
    if (currentPage * usersPerPage < users.length) { 
        currentPage++;
        displayTeachers();
    }
});


document.getElementById('prev-50').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayTeachers();
    }
});



closePopupBtn.addEventListener('click', () => {
    infoPopup.style.display = 'none';
});





const filterButton = document.getElementById('filter-button');
filterButton.addEventListener('click', () => {
    const ageSelect = document.getElementById('age-select').value;
    const countrySelect = document.getElementById('country-select').value;
    const genderSelect = document.getElementById('gender-select').value;
    const favoritesOnly = document.getElementById('favorites-only').checked;

    const filters = {
        country: countrySelect || undefined,
        age: ageSelect ? `>${ageSelect.split('-')[0]} <${ageSelect.split('-')[1]}` : undefined,
        gender: genderSelect || undefined,
        favorite: favoritesOnly ? true : undefined
    };


    const filteredUsers = filterUsers(users, filters);
    tableUsers = filteredUsers;
    usersNow = filteredUsers;
    displayTeachers(); 
    updateTable();
});





let currentSortField = null;
let currentSortOrder = 'asc';


const teacherTableBody = document.getElementById('teacher-table-body');


function updateTable() {
  teacherTableBody.innerHTML = '';
  tableUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.full_name}</td>
      <td>${user.course}</td>
      <td>${user.age}</td>
      <td>${user.gender}</td>
      <td>${user.country}</td>
    `;
    teacherTableBody.appendChild(row);
  });
}


function handleSort(event) {
  const sortBy = event.target.getAttribute('data-sort');
  
  if (sortBy) {
    if (currentSortField === sortBy) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortField = sortBy;
      currentSortOrder = 'asc'; 
    }
    
    const sortedUsers = sortUsers(tableUsers, sortBy, currentSortOrder);
    tableUsers = sortedUsers;
    updateTable(); 
  }
}


document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', handleSort);
});






document.getElementById('search-button').addEventListener('click', () => {
    const searchString = document.getElementById('search-input').value;
    const filteredUsers = searchInArray(users, searchString);
tableUsers = filteredUsers;
usersNow = filteredUsers;
displayTeachers();
updateTable();
});

let currentFavoritePage = 1;
const favoritesPerPage = 5;

function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';
    
    const favoriteTeachers = users.filter(teacher => teacher.favorite);

    if (favoriteTeachers.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorite teachers yet.</p>';
        return;
    }

    const startIndex = (currentFavoritePage - 1) * favoritesPerPage;
    const endIndex = startIndex + favoritesPerPage;
    const teachersToShow = favoriteTeachers.slice(startIndex, endIndex);

    teachersToShow.forEach(teacher => {
        const favCard = document.createElement('div');
        favCard.classList.add('fav-card');
        const profileImage = teacher.picture_large 
        ? `<img src="${teacher.picture_large}" alt="Profile Image" class="profile-img">`
        : `<div class="profile-img">${teacher.full_name.charAt(0).toUpperCase()}</div>`;
    
        favCard.innerHTML = `
            ${profileImage}
            <div class="name">${teacher.full_name}</div>
            <div class="location">${teacher.city}, ${teacher.country}</div>
        `;
        favCard.addEventListener('click', () => {
            openInfoPopup(teacher, favCard);
        });

        favoritesContainer.appendChild(favCard);
    });

    
    document.getElementById('next').style.display = 
        currentFavoritePage * favoritesPerPage >= favoriteTeachers.length ? 'none' : 'block';
    
    
    document.getElementById('prev').style.display = 
        currentFavoritePage === 1 ? 'none' : 'block';
}

document.getElementById('next').addEventListener('click', () => {
    currentFavoritePage++;
    displayFavorites();
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentFavoritePage > 1) {
        currentFavoritePage--;
        displayFavorites();
    }
});



document.querySelector('.plus-button').addEventListener('click', openAddTeacherPopup);
document.querySelector('.add-teacher-nav').addEventListener('click', openAddTeacherPopup);

function gatherAndFormatUserData() {

    const fullName = document.querySelector('.name-add input').value.trim();
    const specialitySelect = document.querySelector('.speciality-add select');
    const speciality = specialitySelect.options[specialitySelect.selectedIndex].text.trim();
    const countrySelect = document.querySelector('.country-add select');
    const country = countrySelect.options[countrySelect.selectedIndex].text.trim();
    const city = document.querySelector('.city-add input').value.trim();
    const email = document.querySelector('.email-add input').value.trim();
    const phone = document.querySelector('.phone-add input').value.trim();
    const dob= new Date(document.querySelector('.birth-add input').value);
    const sex = document.querySelector('input[name="sex"]:checked')?.id; // 'male' or 'female'
    const note = document.querySelector('.notes-add textarea').value.trim();

    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDifference = currentDate.getMonth() - dob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    
    const user = {
        full_name: fullName,
        gender: sex === 'male' ? 'Male' : 'Female',
        note: note || 'No additional information available.', 
        city: city,
        country: country,
        age: age,
        phone: phone,
        email: email,
        course: speciality,
        favorite: false 
    };

    return user;
}


document.querySelector('.add-teacher').addEventListener('click', async (event) => {
    event.preventDefault(); 
    const userData = gatherAndFormatUserData();
    const validationResults = validateUser(userData);

    if (validationResults[0] === 'Об\'єкт валідний!') {
        try {
            
            const response = await fetch('http://localhost:3002/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const newTeacher = await response.json();
                users.unshift(newTeacher); 
                usersNow = users;
                displayTeachers();
                alert('Teacher added successfully!');
                closeAddTeacherPopup();
                updateTable();
            } else {
                alert('Error adding teacher');
            }
        } catch (error) {
            console.error('Error submitting teacher data:', error);
            alert('Error submitting teacher data');
        }
    } else {
        alert(validationResults.join('\n'));
    }
});


function openAddTeacherPopup() {
    document.querySelector('.add-popup').style.display = 'block';
}

function closeAddTeacherPopup() {
    document.querySelector('.add-popup').style.display = 'none';
}

document.querySelector('.close-add').addEventListener('click', closeAddTeacherPopup);




