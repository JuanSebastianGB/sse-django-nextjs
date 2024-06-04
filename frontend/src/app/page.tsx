import Parent from '@/components/Parent/Parent';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid place-content-center">
        <Parent />
      </div>
    </main>
  );
}
