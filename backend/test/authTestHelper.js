const port = 5100;
const SERVER_URL = `http://localhost:${port}`;

export async function requestAuthRegister(
  email,
  name,
  password,
  confirmPassword,
) {
  let data;
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        password,
        confirmPassword,
      }),
    });

    data = await response.json();

    return { status: response.status };
  } catch (error) {
    return { status: 500, message: data.message };
  }
}

export async function requestAuthLogin(email, password) {
  let data;
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    data = await response.json();

    if (response.status == 400) {
      return { status: response.status, message: data.message };
    }

    return { status: response.status, token: data.token };
  } catch (error) {
    return { status: 500, message: data.message };
  }
}

export async function requestChangeEmail(oldEmail, newEmail, token) {
  let data;
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/update/email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldEmail,
        newEmail,
      }),
    });

    data = await response.json();
    if (response.status == 400) {
      return { status: response.status, message: data.message };
    }

    return { status: response.status, message: data.message };
  } catch (error) {
    return { status: 500 };
  }
}

export async function requestChangePassword(oldPassword, newPassword, token) {
  let data;
  try {
    const response = await fetch(
      `${SERVER_URL}/api/auth/update/resetpassword`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      },
    );

    data = await response.json();
    if (response.status == 400) {
      return { status: response.status, message: data.message };
    }

    return { status: response.status, message: data.message };
  } catch (error) {
    return { status: 500 };
  }
}
