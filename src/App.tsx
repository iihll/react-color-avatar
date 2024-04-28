import './App.scss'
import ActionBar from './components/ActionBar'
import ColorAvatar, { ColorAvatarRef } from './components/ColorAvatar'
import useAvatarOption from './hooks/useAvatarOption'
import Container from './layouts/Container'
import { Footer } from './layouts/Footer'
import Header from './layouts/Header'
import Sider from './layouts/Sider'
import { ActionType } from '@/enums'
import { recordEvent } from './utils/ga'
import { useEffect, useRef, useState } from 'react'
import { globalActions, useAppDispatch } from './store'
import { REDO, UNDO } from './store/mutation-type'
import { useTranslation } from 'react-i18next'
import { DOWNLOAD_DELAY, NOT_COMPATIBLE_AGENTS, TRIGGER_PROBABILITY } from './utils/constant'
import { getRandomAvatarOption, getSpecialAvatarOption, showConfetti } from './utils'
import { name as appName } from '../package.json'
import { AvatarOption } from './types'
import Configurator from './components/Configurator'
import CodeModal from './components/CodeModal'
import { DownloadModal } from './components/DownloadModal'

function App() {
  const [avatarOption, setAvatarOption] = useAvatarOption()
  const dispatch = useAppDispatch()
  const [flipped, setFlipped] = useState(false)
  const [codeVisible, setCodeVisible] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadModalVisible, setDownloadModalVisible] = useState(false)
  const [imageDataURL, setImageDataURL] = useState('')
  const { t } = useTranslation()
  const colorAvatarRef = useRef<ColorAvatarRef>(null)

  function handleAction(actionType: ActionType) {
    switch (actionType) {
      case ActionType.Undo:
        dispatch(globalActions[UNDO]())
        recordEvent('action_undo', {
          event_category: 'action',
          event_label: 'Undo',
        })
        break
  
      case ActionType.Redo:
        dispatch(globalActions[REDO]())
        recordEvent('action_redo', {
          event_category: 'action',
          event_label: 'Redo',
        })
        break
  
      case ActionType.Flip:
        setFlipped(!flipped)
        recordEvent('action_flip_avatar', {
          event_category: 'action',
          event_label: 'Flip Avatar',
        })
        break
  
      case ActionType.Code:
        setCodeVisible(!codeVisible)
        recordEvent('action_view_code', {
          event_category: 'action',
          event_label: 'View Avatar Option Code',
        })
        break
    }
  }

  function handleGenerate() {
    if (Math.random() <= TRIGGER_PROBABILITY) {
      let colorfulOption = getSpecialAvatarOption()
      while (
        JSON.stringify(colorfulOption) === JSON.stringify(avatarOption)
      ) {
        colorfulOption = getSpecialAvatarOption()
      }
      colorfulOption.wrapperShape = avatarOption.wrapperShape
      setAvatarOption(colorfulOption)
      showConfetti()
    } else {
      const randomOption = getRandomAvatarOption(avatarOption)
      setAvatarOption(randomOption)
    }
  
    recordEvent('click_randomize', {
      event_category: 'click',
    })
  }

  async function handleDownload() {
    try {
      setDownloading(true)
      const avatarEle = colorAvatarRef.current.avatarRef
  
      const userAgent = window.navigator.userAgent.toLowerCase()
      const notCompatible = NOT_COMPATIBLE_AGENTS.some(
        (agent) => userAgent.indexOf(agent) !== -1
      )
  
      if (avatarEle) {
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(avatarEle.current, {
          backgroundColor: null,
        })
        const dataURL = canvas.toDataURL()
  
        if (notCompatible) {
          setImageDataURL(dataURL)
          setDownloadModalVisible(true)
        } else {
          const trigger = document.createElement('a')
          trigger.href = dataURL
          trigger.download = `${appName}.png`
          trigger.click()
        }
      }
  
      recordEvent('click_download', {
        event_category: 'click',
      })
    } finally {
      setTimeout(() => {
        setDownloading(false)
      }, DOWNLOAD_DELAY)
    }
  }

  const [avatarListVisible, setAvatarListVisible] = useState(false)
  const [avatarList, setAvatarList] = useState<AvatarOption[]>([])
  useEffect(() => {
    setAvatarListVisible(Array.isArray(avatarList) && avatarList.length > 0)
  }, [avatarList])
  async function generateMultiple(count = 5 * 6) {
    const { default: hash } = await import('object-hash')
  
    const avatarMap = [...Array(count)].reduce<Map<string, AvatarOption>>(
      (res) => {
        let randomAvatarOption: AvatarOption
        let hashKey: string
  
        do {
          randomAvatarOption = getRandomAvatarOption(avatarOption)
          hashKey = hash.sha1(randomAvatarOption)
        } while (
          randomAvatarOption.background.color === 'transparent' ||
          res.has(hashKey)
        )
  
        res.set(hashKey, randomAvatarOption)
  
        return res
      },
      new Map()
    )
  
    setAvatarList(Array.from(avatarMap.values()))
  
    recordEvent('click_generate_multiple', {
      event_category: 'click',
    })
  }

  return (
    <main className="main">
      <Container>
        <div className="content-wrapper">
          <div className="content-view">
            <Header />

            <div className="playground">
              <div className="avatar-wrapper">
                <ColorAvatar ref={colorAvatarRef} option={avatarOption} size={280} />
              </div>

              <ActionBar action={handleAction} />

              <div className="action-group">
                <button
                  type="button"
                  className="action-btn action-randomize"
                  onClick={handleGenerate}
                >
                  {t('action.randomize')}
                </button>

                <button
                  type="button"
                  className="action-btn action-download"
                  onClick={handleDownload}
                >
                  {
                    downloading ? `${t('action.downloading')}...` : t('action.download')
                  }
                </button>

                <button
                  type="button"
                  className="action-btn action-multiple"
                  onClick={() => { generateMultiple() }}
                >
                  {t('action.downloadMultiple')}
                </button>
              </div>
            </div>
            
            <Footer />

            <CodeModal visible={codeVisible} close={() => { setCodeVisible(false) }} />

            <DownloadModal 
              visible={downloadModalVisible}
              imageUrl={imageDataURL}
              close={() => {
                setDownloadModalVisible(false)
                setImageDataURL('')
              }}
            />
          </div>

          <div className="gradient-bg">
            <div className="gradient-top"></div>
            <div className="gradient-bottom"></div>
          </div>
        </div>
      </Container>

      <Sider>
        <Configurator />
      </Sider>
    </main>
  )
}

export default App
