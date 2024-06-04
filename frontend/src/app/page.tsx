// import Parent from '@/components/Parent/Parent';

import TableEvents from '@/components/TableEvents/TableEvents';

const CustomComponent = () => {
  return (
    <div className="p-4 bg-slate-300 text-slate-900 rounded-md mb-5">Title</div>
  );
};

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid place-content-center">
        <CustomComponent />
        <TableEvents />
      </div>
    </main>
  );
}
