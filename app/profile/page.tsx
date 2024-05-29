import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  // onClick을 사용하지 않는 이유는, onClick은 클라이언트 이벤트라서 client component이고, server action이 아니기 때문.
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <h1 className="text-4xl ">Welcome, {user?.username} !</h1>
        <form action={logOut}>
          <button>Log out</button>
        </form>
      </div>
    </div>
  );
}
