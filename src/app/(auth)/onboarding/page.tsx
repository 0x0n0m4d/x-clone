import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getUserAction, saveUserAction } from '@/actions/user.action';
import OnBoarding from '@/components/forms/OnBoarding';
import Logout from '@/components/sharing/Logout';

const Page = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (user?.isCompleted) redirect('/home');

  const mapUser = {
    id: clerkUser.id,
    imageUrl: clerkUser.imageUrl,
    name: '',
    username: clerkUser.username!.toLowerCase(),
    email: clerkUser.emailAddresses[0].emailAddress,
    bio: ''
  };

  const temporaryUserData = {
    ...mapUser,
    name: 'unknown',
    isCompleted: false
  };

  await saveUserAction(temporaryUserData);

  return (
    <section className="w-full h-screen">
      <nav className="py-6 border-b border-gray-300">
        <div className="px-3 sm:lg-0 max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/assets/small-x-logo.svg"
            alt="X Logo"
            width={35}
            height={35}
            className="object-contain"
          />
          <Logout>Log Out</Logout>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-3 flex justify-center mt-20 lg:px-0 font-lato">
        <div className="w-full max-w-[500px] flex flex-col space-y-10">
          <div className="text-center flex flex-col space-y-2 items-center max-w-[450px] mx-auto">
            <h1 className="text-3xl font-extrabold tracking-wide">Welcome.</h1>
            <p className="font-normal text-gray-100">
              Let's take a moment to complete your profile so we can provide you
              with better and more personalized experience on our platform.
            </p>
          </div>
          <OnBoarding initialValue={mapUser} />
        </div>
      </section>
    </section>
  );
};

export default Page;
