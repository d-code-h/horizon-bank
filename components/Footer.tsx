import { signOut } from 'next-auth/react';
import Image from 'next/image';

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  return (
    <footer className="footer">
      {' '}
      {/* Footer container */}
      {/* Conditionally styled container for user name */}
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">{user.name[0]}</p>{' '}
        {/* Display first letter of user's name */}
      </div>
      {/* Conditionally styled container for user email and first name */}
      <div
        className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.firstName} {/* Display user's first name */}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email} {/* Display user's email */}
        </p>
      </div>
      {/* Logout button, triggers signOut function when clicked */}
      <div className="footer_image" onClick={async () => await signOut()}>
        <Image src="icons/logout.svg" fill alt="logout" />{' '}
        {/* Image for logout icon */}
      </div>
    </footer>
  );
};

export default Footer;
