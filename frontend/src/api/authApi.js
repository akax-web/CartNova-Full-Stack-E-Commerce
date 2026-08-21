const USERS_KEY = 'cartnova_demo_users';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    userId: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'user',
  };

  users.push(newUser);
  saveUsers(users);

  return Promise.resolve({
    data: {
      data: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  });
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (item) =>
      item.email === normalizedEmail &&
      item.password === password
  );

  if (!user) {
    return Promise.reject(
      new Error('Invalid email or password.')
    );
  }

  return Promise.resolve({
    data: {
      data: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        token: `demo-token-${user.userId}`,
      },
    },
  });
}