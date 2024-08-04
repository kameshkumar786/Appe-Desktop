import Image from "next/image";
import CrudApp from './CrudApp';
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href='/login'>
      <div className="text-2xl bg-slate-200 p-5">Login Page</div>
      </Link>
      

    </main>
  );
}
