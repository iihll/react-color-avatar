import { useTranslation } from "react-i18next"
import { Locale } from '@/enums'
import './Footer.scss'

export function Footer() {
  const { i18n } = useTranslation()

  function switchLocale() {
    i18n.changeLanguage(i18n.language === Locale.EN ? Locale.ZH : Locale.EN)
  }

  return (
    <footer className="footer">
      <div
      data-message="If you are deploying to your own public website, please do not modify it unless you have permission from the original author."
    >
      <a
        className="link"
        href="https://blog.iihll.com"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
      Made by iihll
      </a>
    </div>

    <div className="divider">|</div>

    <div className="locale" onClick={switchLocale}>
      {i18n.language === Locale.EN ? '简体中文' : 'English'}
    </div>

    <div className="divider">|</div>

    <a
      href="https://zeabur.com?referralCode=Codennnn&utm_source=Codennnn"
      target="_blank"
    >
      <img src="https://zeabur.com/deployed-on-zeabur-dark.svg" />
    </a>
    </footer>
  )
}