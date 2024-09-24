import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

/*
// Transforming randomUserMock into a new format
const transformedUsers = randomUserMock.map(user => {
  const { gender, name: { title, first, last }, location, email, dob, phone, picture, login } = user;
  return {
    gender,
    title,
    full_name: `${first} ${last}`,
    city: location.city,
    state: location.state,
    country: location.country,
    postcode: location.postcode,
    coordinates: location.coordinates,
    timezone: location.timezone,
    email,
    b_date: dob.date,
    age: dob.age,
    phone,
    picture_large: picture.large,
    picture_thumbnail: picture.thumbnail,
    id: login.uuid,
    favorite: null,
    course: null,
    bg_color: null,
    note: null
  };
});

// Possible courses for users
const courses = [
  "Mathematics", "Physics", "English", "Computer Science", "Dancing",
  "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"
];

// Function to generate a random hex color
const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// Function to generate a random boolean for the favorite field
const getRandomFavorite = () => Math.random() < 0.5;

// Transforming the user mock again with additional user matching
const transformedUserMock = transformedUsers.map(user => {
  const matchingUser = additionalUsers.find(addUser => addUser.full_name === user.full_name);
  
  return {
    ...user,
    id: matchingUser ? matchingUser.id : null,
    favorite: matchingUser ? matchingUser.favorite : getRandomFavorite(),
    course: matchingUser ? matchingUser.course : courses[Math.floor(Math.random() * courses.length)],
    bg_color: matchingUser ? matchingUser.bg_color : getRandomColor(),
    note: matchingUser ? matchingUser.note : null,
  };
});






const validateUser = (user) => {
  const stringFields = ['full_name', 'gender', 'note', 'state', 'city', 'country'];

  const messages = {
    stringField: (field) => `Поле "${field}" має бути строкою і починатися з великої літери.`,
    age: 'Поле "age" має бути числом і не може бути від\'ємним.',
    phone: 'Поле "phone" має відповідати формату: +XXXXXXXXXX.',
    email: 'Поле "email" має бути дійсним адресою електронної пошти.',
    valid: 'Об\'єкт валідний!'
  };

  const isCapitalized = (str) => {
    const trimmedStr = str.trim();
    return typeof trimmedStr === 'string' && trimmedStr !== '' && /^[A-ZА-ЯЁІЇ]/u.test(trimmedStr);
  };

  const errors = [];

  const validateStringFields = () => {
    for (const field of stringFields) {
      const fieldValue = user[field];
      if (typeof fieldValue !== 'string' || !isCapitalized(fieldValue)) {
        errors.push(messages.stringField(field));
      }
    }
  };

  const validateAge = () => {
    if (typeof user.age !== 'number' || user.age < 0) {
      errors.push(messages.age);
    }
  };

  const validatePhone = () => {
    const countryPhoneRegex = {
      'Ukraine': /^\+380(67|68|96|97|98|50|51|63|66|93|94)\d{7}$/, // +380 followed by specific prefixes
      'Germany': /^\+49(15|16|17|30|40|41|70)\d{8}$/,              // +49 followed by specific prefixes
      'Norway': /^\+47\d{8}$/,                                   // +47 followed by 8 digits
      'France': /^\+33(6|7)\d{8}$/,                             // +33 followed by 6 or 7
      'Denmark': /^\+45\d{8}$/,                                 // +45 followed by 8 digits
      'United States': /^\+1\d{10}$/,                           // +1 followed by 10 digits
      'Canada': /^\+1\d{10}$/,                                  // +1 followed by 10 digits
      'Netherlands': /^\+31(6)\d{8}$/,                          // +31 followed by 6
      'Switzerland': /^\+41\d{9}$/,                             // +41 followed by 9 digits
      'Iran': /^\+98\d{10}$/,                                   // +98 followed by 10 digits
      'Spain': /^\+34\d{9}$/,                                   // +34 followed by 9 digits
      'Turkey': /^\+90(5\d{9})$/,                               // +90 followed by 5
      'Ireland': /^\+353(8|7)\d{8}$/,                           // +353 followed by 8 or 7
      'Finland': /^\+358\d{9}$/,                                // +358 followed by 9 digits
      'New Zealand': /^\+64\d{9}$/,                             // +64 followed by 9 digits
      'Australia': /^\+61(4)\d{8}$/,                            // +61 followed by 4
      'China': /^\+86\d{11}$/                                   // +86 followed by 11 digits
    };

    const generalPhoneRegex = /^\+?[0-9]{10,15}$/;
    const phone = user.phone;
    const country = user.country;

    const phoneRegex = countryPhoneRegex[country] || generalPhoneRegex;

    if (typeof phone !== 'string' || !phoneRegex.test(phone)) {
      errors.push(messages.phone);
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof user.email !== 'string' || !emailRegex.test(user.email)) {
      errors.push(messages.email);
    }
  };

  // Execute all validation functions
  validateStringFields();
  validateAge();
  validatePhone();
  validateEmail();

  return errors.length > 0 ? errors : [messages.valid];
};

const validateUsersArray = (transformedUserMock) => {
  return transformedUserMock.map(user => {
    const validationResults = validateUser(user);
    return {
      user,
      validationResults,
    };
  });
};

// Example usage

const validationResults = validateUsersArray(transformedUserMock);
console.log(validationResults);


const filterUsers = (users, filters) => {
  return users.filter(user => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true; // Skip if the value is not set

      if (key === 'age') {
        // Handle age conditions
        const conditions = value.split(' ').map(condition => condition.trim());
        return conditions.every(condition => {
          if (condition.startsWith('<')) {
            return user.age < parseInt(condition.slice(1), 10);
          } else if (condition.startsWith('>')) {
            return user.age > parseInt(condition.slice(1), 10);
          } else if (condition.startsWith('=')) {
            return user.age === parseInt(condition.slice(1), 10);
          }
          return false;
        });
      }

      // Handle other parameters
      return user[key] === value;
    });
  });
};


const filters = {
  country: 'Ukraine',
  age: '<36', // Age must be greater than 15 and less than 36
  gender: 'female',
  favorite: null // Ignore this parameter
};


const sortUsers = (users, sortBy, order = 'asc') => {
  return users.sort((a, b) => {
    if (!(sortBy in a) || !(sortBy in b)) {
      throw new Error(`Property "${sortBy}" does not exist on user objects.`);
    }

    let comparison = 0;

    if (sortBy === 'b_date') {
      // Convert birthday strings to Date objects for comparison
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      comparison = dateA - dateB; // Subtract to get the difference in milliseconds
    } else if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    } else {
      comparison = (a[sortBy] || 0) - (b[sortBy] || 0); // Handle undefined values gracefully
    }

    return order === 'asc' ? comparison : -comparison;
  });
};
*/
function searchInArray(array, searchString) {
  // Check for age conditions
  const ageConditions = searchString.match(/(>|<|>=|<=)?(\d+)/g);
  
  if (ageConditions) {
    return array.filter(item => {
      let age = item.age;

      // Check if all conditions are met
      return ageConditions.every(condition => {
        const operator = condition[0] || '='; // Default to '=' if no operator
        const value = parseInt(condition.slice(1)); // Get numeric value

        switch (operator) {
          case '>':
            return age > value;
          case '<':
            return age < value;
          case '>=':
            return age >= value;
          case '<=':
            return age <= value;
          case '=':
          default:
            return age == searchString; // Equal case
        }
      });
    });
  }

  // If no age conditions, filter by name or note
  return array.filter(item => {
    return item.name.includes(searchString) || item.note.includes(searchString);
  });
}

// Example array of objects
const data = [
  { name: 'Alice', note: 'Good Bob', age: 30 },
  { name: 'Bob', note: 'Average', age: 45 },
  { name: 'Charlie', note: 'Excellent', age: 50 },
  { name: 'David', note: 'Poor', age: 22 }
];

const data1 = [
  { name: 'Alice', note: 'Good Bob', age: 30 },
  { name: 'Bob', note: 'Average', age: 45 },
  { name: 'Charlie', note: 'Excellent', age: 50 },
  { name: 'David', note: 'Poor', age: 22 },
  { name: 'Alice', note: 'Good Bob', age: 30 },
  { name: 'Bob', note: 'Average', age: 45 },
  { name: 'Charlie', note: 'Excellent', age: 50 },
  { name: 'David', note: 'Poor', age: 22 }
];

// Example usage
// const results1 = searchInArray(data, 'Poor');
// console.log(results1); // Should match ages within that range

// const results2 = searchInArray(data, 'Alice');
// console.log(results2); // Should match the object with age 22


function countPercentage(array1, array2) {
  return (array1.length / array2.length) * 100;
}

console.log(countPercentage(data, data1))
