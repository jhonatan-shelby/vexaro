import { redirect } from 'next/navigation';

export default function Home() {
  // Para la Fase 0, redirigimos al login por defecto
  redirect('/login');
}
