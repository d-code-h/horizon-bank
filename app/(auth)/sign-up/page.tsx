import AuthForm from '@/components/AuthForm';

const SignUp = () => {
  return (
    // Centering the sign-up form on the page
    <section className="flex-center size-full max-sm:px-6">
      {/* AuthForm component with sign-up type */}
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
