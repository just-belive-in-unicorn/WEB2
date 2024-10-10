import { validateUser, sortUsers, searchInArray, filterUsers, transformedUserMock } from '/js/test-module.js';

const users = transformedUserMock; 
const teachersContainer = document.getElementById('teachers-container');
const infoPopup = document.getElementById('info-popup');
const closePopupBtn = document.querySelector('.close-info');


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


        displayTeachers(users);
        displayFavorites(users);
    };
}




function displayTeachers(teachers) {
    teachersContainer.innerHTML = '';
    teachers.forEach(teacher => {
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

    
    displayFavorites(teachers);
}

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
    displayTeachers(filteredUsers); 
});





let currentSortField = null;
let currentSortOrder = 'asc';


const teacherTableBody = document.getElementById('teacher-table-body');


function updateTable(users) {
  teacherTableBody.innerHTML = '';
  users.forEach(user => {
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
    
    const sortedUsers = sortUsers(users, sortBy, currentSortOrder);
    updateTable(sortedUsers); 
  }
}


document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', handleSort);
});






document.getElementById('search-button').addEventListener('click', () => {
    const searchString = document.getElementById('search-input').value;
    const filteredUsers = searchInArray(users, searchString);
    displayTeachers(filteredUsers);
});


function displayFavorites(teachers) {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = ''; // Clear existing favorites
    
    const favoriteTeachers = teachers.filter(teacher => teacher.favorite); // Get favorite teachers

    if (favoriteTeachers.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorite teachers yet.</p>';
        return;
    }
    favoriteTeachers.forEach(teacher => {
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
}





document.querySelector('.plus-button').addEventListener('click', openAddTeacherPopup);
document.querySelector('.add-teacher-nav').addEventListener('click', openAddTeacherPopup);

function gatherAndFormatUserData() {
    // Get values from the form
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
        gender: sex === 'male' ? 'Male' : 'Female', // Convert to expected format
        note: note || 'No additional information available.', // Default if empty
        city: city,
        country: country,
        age: age,
        phone: phone,
        email: email,
        course: speciality, // Assuming 'speciality' is equivalent to 'course'
        favorite: false // Assuming new teachers are not favorites by default
    };

    return user;
}


document.querySelector('.add-teacher').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    const userData = gatherAndFormatUserData();
    const validationResults = validateUser(userData);
    
    if (validationResults[0] === 'Об\'єкт валідний!') {
        users.unshift(userData);
        displayTeachers(users);
        
        alert('Teacher added successfully!');
        
        // Close the popup
        closeAddTeacherPopup();
        
        
    } else {
        // If there are errors, inform the user
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


updateTable(users);
displayTeachers(users);
