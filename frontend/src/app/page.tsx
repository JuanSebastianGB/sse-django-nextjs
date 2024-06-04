import { CustomComponent } from '@/components/CustomComponent';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid place-content-center">
        <CustomComponent />
      </div>
    </main>
  );
}
