import useAvatarOption from '@/hooks/useAvatarOption'
import {
  type WidgetShape,
  type WrapperShape,
  BeardShape,
  WidgetType,
} from '@/enums'
import { AVATAR_LAYER, SETTINGS } from '@/utils/constant'
import { previewData } from '@/utils/dynamic-data'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import PerfectScrollbar from '../PerfectScrollbar'
import SectionWrapper from '../SectionWrapper'
import classNames from 'classnames'

export default function Configurator() {
  const { t } = useTranslation()

  const [avatarOption, setAvatarOption] = useAvatarOption()
  const sectionList = Object.values(WidgetType)
  const [sections, setSections] = useState<{
    widgetType: WidgetType
    widgetList: {
      widgetType: WidgetType
      widgetShape: WidgetShape
      svgRaw: string
    }[]
  }[]>([])

  useEffect(() => {
    void (async () => {
      const a = await Promise.all(
        sectionList.map((section) => {
          return getWidgets(section)
        })
      )

      setSections(sectionList.map((li, i) => {
        return {
          widgetType: li,
          widgetList: a[i],
        }
      }))
    })()
  }, [])



  async function getWidgets(widgetType: WidgetType) {
    const list = SETTINGS[`${widgetType}Shape`]
    // const promises: Promise<string>[] = list.map(async (widget: string) => {
    //   return (await import(`../assets/preview/${widgetType}/${widget}.svg?raw`))
    //     .default
    // })
    const promises: Promise<string>[] = list.map(async (widget: string) => {
      if (widget !== 'none' && previewData?.[widgetType]?.[widget]) {
        return (await previewData[widgetType][widget]()).default
      }
      return 'X'
    })
    const svgRawList = await Promise.all(promises).then((raw) => {
      return raw.map((svgRaw, i) => {
        return {
          widgetType,
          widgetShape: list[i],
          svgRaw,
        }
      })
    })
    return svgRawList
  }
  
  function switchWrapperShape(wrapperShape: WrapperShape) {
    if (wrapperShape !== avatarOption.wrapperShape) {
      setAvatarOption({ ...avatarOption, wrapperShape })
    }
  }
  
  function switchBorderColor(borderColor: string) {
    if (borderColor !== avatarOption.background.borderColor) {
      setAvatarOption({
        ...avatarOption,
        background: { ...avatarOption.background, borderColor },
      })
    }
  }
  
  function switchBgColor(bgColor: string) {
    if (bgColor !== avatarOption.background.color) {
      setAvatarOption({
        ...avatarOption,
        background: { ...avatarOption.background, color: bgColor },
      })
    }
  }
  
  function switchWidget(widgetType: WidgetType, widgetShape: WidgetShape) {
    if (widgetShape && avatarOption.widgets?.[widgetType]) {
      setAvatarOption({
        ...avatarOption,
        widgets: {
          ...avatarOption.widgets,
          [widgetType]: {
            ...avatarOption.widgets?.[widgetType],
            shape: widgetShape,
            ...(widgetShape === BeardShape.Scruff
              ? { zIndex: AVATAR_LAYER['mouth'].zIndex - 1 }
              : undefined),
          },
        },
      })
    }
  }
  
  function setWidgetColor(widgetType: WidgetType, fillColor: string) {
    if (avatarOption.widgets?.[widgetType]) {
      setAvatarOption({
        ...avatarOption,
        widgets: {
          ...avatarOption.widgets,
          [widgetType]: {
            ...avatarOption.widgets?.[widgetType],
            fillColor,
          },
        },
      })
    }
  }
  
  function getWidgetColor(type: string) {
    if (
      type === WidgetType.Face ||
      type === WidgetType.Tops ||
      type === WidgetType.Clothes
    ) {
      return avatarOption.widgets[type]?.fillColor
    } else return ''
  }

  return (
    <PerfectScrollbar className="configurator-scroll">
      <div className="configurator">
        <SectionWrapper title={t('label.wrapperShape')}>
          <ul className="wrapper-shape">
            {SETTINGS.wrapperShape.map(wrapperShape => {
              return (
                <li
                  key={wrapperShape}
                  className="wrapper-shape__item"
                  title={t(`wrapperShape.${wrapperShape}`)}
                  onClick={() => { switchWrapperShape(wrapperShape) }}
                >
                  <div
                    className={classNames('shape', { wrapperShape, active: wrapperShape === avatarOption.wrapperShape })}
                  />
                </li>
              )
            })}
          </ul>
        </SectionWrapper>
        
        <SectionWrapper title={t('label.borderColor')}>
          <ul className="color-list">
            {SETTINGS.borderColor.map(borderColor => {
              return (
                <li
                  key={borderColor}
                  className="color-list__item"
                  onClick={() => { switchBorderColor(borderColor) }}
                >
                  <div
                    style={{ background: borderColor }}
                    className={classNames('bg-color', {
                      active: borderColor === avatarOption.background.borderColor,
                      transparent: borderColor === 'transparent',
                    })}
                  />
                </li>
              )
            })}
          </ul>
        </SectionWrapper>

        <SectionWrapper title={t('label.backgroundColor')}>
          <ul className="color-list">
            {SETTINGS.backgroundColor.map(bgColor => {
              return (
                <li
                  key={bgColor}
                  className="color-list__item"
                  onClick={() => { switchBgColor(bgColor) }}
                >
                  <div
                    style={{ background: bgColor }}
                    className={classNames('bg-color', {
                      active: bgColor === avatarOption.background.color,
                      transparent: bgColor === 'transparent',
                    })}
                  />
                </li>
              )
            })}
          </ul>
        </SectionWrapper>

        {sections.map(s => {
          return (
            <SectionWrapper key={s.widgetType} title={t(`widgetType.${s.widgetType}`)}>
              {(s.widgetType === WidgetType.Tops ||
                s.widgetType === WidgetType.Face ||
                s.widgetType === WidgetType.Clothes) ? 
                <details className="color-picker" open={s.widgetType === WidgetType.Face}>
                  <summary className="color">{t('label.colors')}</summary>
                  <ul className="color-list">
                    {SETTINGS[s.widgetType === WidgetType.Face ? 'skinColors' : 'commonColors'].map(fillColor => {
                      return (
                        <li key={fillColor} className="color-list__item" onClick={() => { setWidgetColor(s.widgetType, fillColor) }}>
                          <div
                            style={{background: fillColor}} 
                            className={classNames('bg-color', { active: fillColor === getWidgetColor(s.widgetType) })}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </details>
                : null}

                <ul className="widget-list">
                  {s.widgetList.map(it => {
                    return (
                      <li
                        key={it.widgetShape}
                        className={classNames('list-item', { selected: it.widgetShape === avatarOption.widgets?.[s.widgetType]?.shape})}
                        dangerouslySetInnerHTML={{ __html: it.svgRaw }}
                        onClick={() => { switchWidget(s.widgetType, it.widgetShape) }}
                      ></li>
                    )
                  })}
                </ul>
            </SectionWrapper>
          )
        })}
      </div>
    </PerfectScrollbar>
  )
}