import { AvatarOption } from "@/types";
import './Border.scss'

export default function Background(props: {
  color: AvatarOption['background']['borderColor']
  radius: string
}) {
  return (
    <div className="avatar-border" style={{borderColor: props.color, borderRadius: props.radius}}></div>
  )
}