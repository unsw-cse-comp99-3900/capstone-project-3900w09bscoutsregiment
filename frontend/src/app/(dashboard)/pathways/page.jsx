import checkAuthStatus from '@/app/authenticator/auth';

const Pathways = async () => {
  console.log('pathways called');

  const isLoggedIn = await checkAuthStatus();
  if (! isLoggedIn) {
    console.log('check auth status failed so we are returning you');
    return <div>not allowed</div>;
  }

  console.log('check auth status was true so we are showing pathways');
  return <div>Pathways</div>;
};

export default Pathways;
