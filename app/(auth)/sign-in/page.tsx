import AuthForm from '@/components/AuthForm';

const SignIn = () => {
  return (
    // Container section that centers the form on the screen
    <section className="flex-center size-full max-sm:px-6">
      {/* AuthForm component with sign-in type */}
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
