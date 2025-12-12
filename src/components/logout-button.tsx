import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function LogoutButton() {
  // get session
  const session = await auth();

  return (
    <div className="font-sans text-center items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>NAME: {session?.user?.name}</h1>
      <h1>USER_ID: {session?.user?._id}</h1>
      <h1>ROLE: {session?.user?.role}</h1>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit" variant="secondary" disabled={!session?.user}>
          Sign out
        </Button>
      </form>
    </div>
  );
}
