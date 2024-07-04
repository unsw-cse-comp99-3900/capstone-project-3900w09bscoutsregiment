export default async function checkAuthStatus() {
  console.log('check auth status called');

  const port = 5000;
  const res = await fetch(`http://localhost:${port}/status`, {
    method: 'GET',
    credentials: 'include',
  });

  console.log('req sent');

  const data = await res.json();
  console.log(data);

  if (data.loggedIn) {
    console.log('auth status returning true');
    return true;
  } else {
    console.log('auth status returning false');
    return false;
  }
}
