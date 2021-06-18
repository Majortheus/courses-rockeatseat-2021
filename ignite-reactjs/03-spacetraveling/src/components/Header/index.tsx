import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const router = useRouter();

  function handleLogoClick(): void {
    router.push('/', '', {});
  }

  return (
    <header className={styles.header}>
      <img src="/images/Logo.svg" alt="logo" onClick={handleLogoClick} />
    </header>
  );
}
