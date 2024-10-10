

import {randomUserMock, additionalUsers } from '/js/FE4U-Lab2-mock.js';

/*
Данні з обєкту random-user-mock привести до given вигляду;
До кожного з об’єктів масиву додати поля: id, favorite, course, bg_color,
note, заповнюючи їх ПРАВИЛЬНИМ типом данних. По’єднати два обєкти
(random_user_mock та additional_users) в один, позбуваючись повторів,
якщо такі є. Значення поля course заповнювати рандомно зі списку:
Mathematics, Physics, English, Computer Science, Dancing, Chess, Biology, Chemistry,
Law, Art, Medicine, Statistics
Обєкти можуть мати не однакову кількість полів та різні інтерфейси. Результатом
виконання, є функція, що повертає масив відформатованних об’єктів. 
*/
export const transformedUsers = randomUserMock.map(user => {
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


const courses = [
  "Mathematics", "Physics", "English", "Computer Science", "Dancing",
  "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"
];


export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};


const getRandomFavorite = () => Math.random() < 0.5;


export const transformedUserMock = transformedUsers.map(user => {
  const matchingUser = additionalUsers.find(addUser => addUser.full_name === user.full_name);
  
  return {
    ...user,
    id: matchingUser ? matchingUser.id : null,
    favorite: matchingUser ? matchingUser.favorite : getRandomFavorite(),
    course: matchingUser && matchingUser.course ? matchingUser.course : courses[Math.floor(Math.random() * courses.length)],
    bg_color: matchingUser ? matchingUser.bg_color : getRandomColor(),
    note: matchingUser ? matchingUser.note : null,
  };
});

console.log(transformedUserMock);

/*

 Провалідувати обєкт. Тобто перевірити, чи відповідають поля
заданого обєкту вимогам до нього. Валідними вважаються такі поля, які
відповідають наступним вимогам: 
Поля full_name, gender, note, state, city, country мають бути
строками, та починатись з великої літери.
Поле age має бути чисельним.
Поле phone має відповідати заданому формату (формат залежить від
країни).
Поле email має відповідати формату запису email, тобто мати @. 
*/
export const validateUser = (user) => {
  const stringFields = ['full_name', 'gender', 'city', 'country'];

  const messages = {
    stringField: (field) => `Поле "${field}" має бути строкою і починатися з великої літери.`,
    age: 'Поле "age" має бути числом і не може бути від\'ємним.',
    phone: 'Поле "phone" має відповідати формату: +XXXXXXXXXX.',
    email: 'Поле "email" має бути дійсним адресою електронної пошти.',
    valid: 'Об\'єкт валідний!'
  };

  const isCapitalized = (str) => {
    const trimmedStr = str.trim();
    return typeof trimmedStr === 'string' && trimmedStr !== '' && /^[A-ZА-ЯІЇ]/u.test(trimmedStr);
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
    if (typeof user.age !== 'number' || user.age < 18) {
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

// Example
const testUser = {
  full_name: 'john doe',        
  gender: 'male',               
  note: 'test note',                     
  city: 'los angeles',          
  country: 'Ukraine',          
  age: 25,                     
  phone: '+380631234567',       
  email: 'johndoe@example.com', 
};

const validationResult = validateUser(testUser);
console.log(validationResult);




/*
Написати функцію фільтрації массиву обєктів за параметрами
(параметри змінними). Параметри є полями обєкту: country, age, gender,
favorite. Фільтрація повинна працювати як логічне «і». 
*/
export const filterUsers = (users, filters) => {
  return users.filter(user => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true; 

      if (key === 'age') {
        
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

      
      return user[key] === value;
    });
  });
};
// Example
const users = [
  { full_name: 'Anna Ivanova', age: 25, country: 'Ukraine', gender: 'female', favorite: true },
  { full_name: 'Oleg Petrov', age: 34, country: 'Ukraine', gender: 'male', favorite: false },
  { full_name: 'Maria Smith', age: 28, country: 'USA', gender: 'female', favorite: true },
  { full_name: 'John Doe', age: 40, country: 'Ukraine', gender: 'male', favorite: false },
  { full_name: 'Irina Kuznetsova', age: 30, country: 'Ukraine', gender: 'female', favorite: true }
];
const filters = { country: 'Ukraine', age: '<36', gender: 'female' };
const result = filterUsers(users, filters);
console.log(result);








/*
Написати функцію сортування массиву обєктів за параметрами
(параметри змінними). Сортування може бути як за зростанням так і за спаданням.
Сортуватись можуть чисельні поля та строкові: full_name, age, b_day, country.
Сортування працює по одному парамету (логічне «або») 
*/
export const sortUsers = (users, sortBy, order = 'asc') => {
  return users.sort((a, b) => {
    if (!(sortBy in a) || !(sortBy in b)) {
      throw new Error(`Property "${sortBy}" does not exist on user objects`);
    }

    let comparison = 0;

    if (sortBy === 'b_date') {
      
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      comparison = dateA - dateB;
    } else if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
      comparison = a[sortBy].localeCompare(b[sortBy]);
    } else {
      comparison = (a[sortBy]) - (b[sortBy]); 
    }

    return order === 'asc' ? comparison : -comparison;
  });
};

//Exapmle
const users1 = [
  { full_name: "Олексій Петренко", age: 25, b_date: "1998-05-14", country: "Україна" },
  { full_name: "Марія Іваненко", age: 30, b_date: "1993-03-22", country: "Україна" },
  { full_name: "Анна Сидоренко", age: 22, b_date: "2001-08-10", country: "Україна" },
];
  const sortedUsers = sortUsers(users, 'age', 'asc');
  console.log(sortedUsers);


/*
Знайти в массиві об’єкт, який відповідає параметру пошуку.
Параметром може бути як строкове, так і чисельне поле: name, note, age. 
*/
export function searchInArray(array, searchString) {
  const ageConditions = searchString.match(/(>=|<=|>|<)?(\d+)/g);

  if (searchString === '') {
    return array;
  }

  if (ageConditions) {
    return array.filter(item => {
      let age = item.age;

      return ageConditions.every(condition => {
        let operator, value;

        const match = condition.match(/(>=|<=|>|<)?(\d+)/);
        if (match) {
          operator = match[1] || '=';
          value = parseInt(match[2]);

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
              return age == value;
          }
        }
      });
    });
  }

  return array.filter(item => {
    const name = item.full_name || ''; // Use an empty string if undefined
    const note = item.note || ''; // Use an empty string if undefined
    return name.includes(searchString) || note.includes(searchString);
  });
}


//Example
const users2 = [
  { name: 'Alice Smith', age: 25, note: 'Loves programming' },
  { name: 'Bob Johnson', age: 30, note: 'Enjoys hiking' },
  { name: 'Charlie Brown', age: 35, note: 'Fan of art' },
  { name: 'Diana Prince', age: 28, note: 'Coffee enthusiast' },
  { name: 'Edward King', age: 40, note: 'Football player' },
];
const searchResult1 = searchInArray(users2, '>=30');
console.log(searchResult1); 





/*
Написати функцію, яка повертає відсоток від загального числа обєктів
в массиві, що відповідають пошуку. Тобто, якщо у нас пошук за віком більше 30, то
функція поверне число відсотків, які відповідають кількості юзерів. Пр: загальна
кількість юзерів – 50, з них 30 за віком більше 30 років, то функція поверне 60. 
*/
function countPercentage(array1, array2) {
  return (array1.length / array2.length) * 100;
}

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
console.log(countPercentage(data, data1));

