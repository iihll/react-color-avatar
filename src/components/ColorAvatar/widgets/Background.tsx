import { AvatarOption } from "@/types";
import './Background.scss'

export default function Background(props: {
  color: AvatarOption['background']['color']
}) {
  return (
    <div className="avatar-background" style={{background: props.color}}></div>
  )
}