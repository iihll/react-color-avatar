import './index.scss'
import classnames from 'classnames'
import { WidgetType, WrapperShape } from '@/enums'
// import type { AvatarOption } from '@/types'
import { getRandomAvatarOption } from '@/utils'
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AVATAR_LAYER, NONE, SHAPE_STYLE_SET } from '@/utils/constant'
import { widgetData } from '@/utils/dynamic-data'

import Background from './widgets/Background'
import Border from './widgets/Border'
import { AvatarOption } from '@/types'

interface Props {
  id?: string
  option: AvatarOption
  size?: number
}

export interface ColorAvatarRef {
  avatarRef: MutableRefObject<HTMLDivElement>
}

const ColorAvatar = forwardRef<ColorAvatarRef, Props>(function ColorAvatar(props = {
  option: getRandomAvatarOption(),
  size: 280,
}, ref) {
  const [svgContent, setSvgContent] = useState('')
  const avatarRef = useRef<HTMLDivElement>()

  useImperativeHandle(ref, () => ({
    avatarRef: avatarRef
  }))

  function getWrapperShapeClassName() {
    const { option: avatarOption } = props
    return {
      [WrapperShape.Circle]:
        avatarOption.wrapperShape === WrapperShape.Circle,
      [WrapperShape.Square]:
        avatarOption.wrapperShape === WrapperShape.Square,
      [WrapperShape.Squircle]:
        avatarOption.wrapperShape === WrapperShape.Squircle,
    }
  }

  function getWrapperShapeStyle() {
    const { option: avatarOption } = props

    return SHAPE_STYLE_SET[avatarOption.wrapperShape!]
  }

  async function draw() {
    const { option: avatarOption } = props

    const sortedList = Object.entries(avatarOption.widgets).sort(
      ([prevShape, prev], [nextShape, next]) => {
        const ix = prev.zIndex ?? AVATAR_LAYER[prevShape]?.zIndex ?? 0
        const iix = next.zIndex ?? AVATAR_LAYER[nextShape]?.zIndex ?? 0
        return ix - iix
      }
    )
  
    // const promises: Promise<string>[] = sortedList.map(async ([widgetType, opt]) => {
    //   return (
    //     await import(`../assets/widgets/${widgetType}/${opt.shape}.svg?raw`)
    //   ).default
    // })
  
    const promises: Promise<string>[] = sortedList.map(
      async ([widgetType, opt]) => {
        if (opt.shape !== NONE && widgetData?.[widgetType]?.[opt.shape]) {
          return (await widgetData[widgetType][opt.shape]()).default
        }
        return ''
      }
    )
  
    let skinColor: string | undefined
  
    const svgRawList = await Promise.all(promises).then((raw) => {
      return raw.map((svgRaw, i) => {
        const [widgetType, widget] = sortedList[i]
        let widgetFillColor = widget.fillColor
  
        if (widgetType === WidgetType.Face) {
          skinColor = widgetFillColor
        }
        if (skinColor && widgetType === WidgetType.Ear) {
          widgetFillColor = skinColor
        }
  
        const content = svgRaw
          .slice(svgRaw.indexOf('>', svgRaw.indexOf('<svg')) + 1)
          .replace('</svg>', '')
          .replaceAll('$fillColor', widgetFillColor || 'transparent')
  
        return `
          <g id="vue-color-avatar-${sortedList[i][0]}">
            ${content}
          </g>
        `
      })
    })
  
    const { size: avatarSize } = props
    setSvgContent(`
    <svg
      width="${avatarSize}"
      height="${avatarSize}"
      viewBox="0 0 ${avatarSize / 0.7} ${avatarSize / 0.7}"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(100, 65)">
        ${svgRawList.join('')}
      </g>
    </svg>
  `)
  }

  useEffect(() => {
    draw()
  }, [props.option])

  return (
    <div ref={avatarRef} className={classnames('color-avatar', getWrapperShapeClassName())} style={getWrapperShapeStyle()}>
      <Background color={props.option.background.color} />

      <div className="avatar-payload" dangerouslySetInnerHTML={{ __html: svgContent }}></div>

      <Border
        color={props.option.background.borderColor}
        radius={getWrapperShapeStyle().borderRadius}
      />
    </div>
  )
})

export default ColorAvatar