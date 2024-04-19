import {usePrivy} from '@privy-io/react-auth';

const LogoutButton = () => {
  const {ready, authenticated, logout} = usePrivy();
  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated);

  return (
    <button 
        disabled={disableLogout}
        onClick={logout}
        className="border-2 border-fuchsia-300 flex flex-row items-center bg-white rounded-lg px-4 py-[6px] hover:bg-fuchsia-300 text-transparent hover:text-white transition-colors duration-300 ease-in-out"
        >
        <p className="font-bold bg-gradient-to-r from-violet-400 to-fuchsia-300 bg-clip-text text-lg hover:text-white"> 
            Log out
        </p>    
    </button>
  );
}

export default LogoutButton;