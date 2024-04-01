import LogoSvg from '@/assets/logo.svg'

export default function Logo(props: { size?: number }) {
  const { size } = props

  return (
    <img style={{ width: size ? `${size}rem` : '40px', height: size ? `${size}rem` : '40px' }} src={LogoSvg} alt="logo" />
  )
}