import IconGitHub from '@/assets/icons/icon-github.svg'
import Logo from '@/components/Logo'
import { recordEvent } from '@/utils/ga'
import './Header.scss'

export default function Header() {
  return (
    <header className="header">
      <Logo />

      <h2 className="site-title">Color Avatar</h2>

      <div className="header-right">
      <a
        href="https://github.com/iihll/react-color-avatar"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <button
          type="button"
          className="github-button"
          onClick={() => {
            recordEvent('click_github', {
              event_category: 'click',
            })
          }}
        >
          <img src={IconGitHub} alt="GitHub" />
          <span className="text">GitHub</span>
        </button>
      </a>
      </div>
    </header>
  )
}