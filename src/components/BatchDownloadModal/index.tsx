import './index.scss'
import type { AvatarOption } from '@/types'
import { recordEvent } from '@/utils/ga'
import { name as appName } from '../../../package.json'
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import PerfectScrollbar from '../PerfectScrollbar';
import ColorAvatar from '../ColorAvatar';

export interface BatchDownloadModalProps {
  visible?: boolean;
  avatarList?: AvatarOption[]
  regenerate?: () => void
  close?: () => void

}

export default function BatchDownloadModal(props: BatchDownloadModalProps) {
  const { t } = useTranslation()
  const [making, setMaking] = useState(false)
  const [madeCount, setMadeCount] = useState(0)

  async function handleDownload(avatarIndex: number) {
    const avatarEle = window.document.querySelector(`#avatar-${avatarIndex}`)
  
    if (avatarEle instanceof HTMLElement) {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(avatarEle, {
        backgroundColor: null,
      })
      const dataURL = canvas.toDataURL()
  
      const trigger = document.createElement('a')
      trigger.href = dataURL
      trigger.download = `${appName}.png`
      trigger.click()
    }
  
    recordEvent('click_download', {
      event_category: 'click',
    })
  }
  
  async function make() {
    if (props.avatarList && !making) {
      setMaking(true)
      setMadeCount(1)
  
      const html2canvas = (await import('html2canvas')).default
  
      const { default: JSZip } = await import('jszip')
      const jsZip = new JSZip()
  
      for (let i = 0; i <= props.avatarList.length; i += 1) {
        const dom = window.document.querySelector(`#avatar-${i}`)
  
        if (dom instanceof HTMLElement) {
          const canvas = await html2canvas(dom, {
            backgroundColor: null,
          })
  
          const dataUrl = canvas.toDataURL().replace('data:image/png;base64,', '')
          jsZip.file(`${i + 1}.png`, dataUrl, { base64: true })
          setMadeCount(prevMadeCount => prevMadeCount + 1)
        }
      }
  
      const base64 = await jsZip.generateAsync({ type: 'base64' })
  
      setMaking(false)
      setMadeCount(0)
  
      const a = window.document.createElement('a')
      a.href = 'data:application/zip;base64,' + base64
      a.download = `${appName}.zip`
      a.click()
  
      recordEvent('click_download_multiple', {
        event_category: 'click',
      })
    }
  }

  return (
    <ModalWrapper visible={props.visible} close={() => { props.close() }}>
      <div className="batch-download-container">
        <div className="top-bar">
          <div>{ t('text.downloadMultipleTip') }</div>
          <div className="right">
            <button
              type="button"
              className="regenerate-btn"
              disabled={making}
              onClick={() => { props.regenerate() }}
            >
              { t(`text.regenerate`) }
            </button>

            <button type="button" className="download-btn" onClick={make}>
              {
                making
                  ? `${t('text.downloadingMultiple')}(${madeCount}/${
                      props.avatarList?.length
                    })`
                  : t(`text.downloadMultiple`)
              }
            </button>
          </div>
        </div>

        <div className="content-box">
          <PerfectScrollbar className="batch-download-scroll-wrapper" options={{ suppressScrollX: false }}>
            <div className="content">
              {props.avatarList.map((opt, i) => {
                return (
                  <div
                  className="avatar-box"
                  style={{ opacity: making && i + 1 > madeCount ? 0.5 : 1 }}
                >
                  <ColorAvatar id={`avatar-${i}`} option={opt} size={280} />

                  <button className="download-single" onClick={() => { handleDownload(i) }}>
                    { t('action.download') }
                  </button>
                </div>
                )
              })}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </ModalWrapper> 
  )
}