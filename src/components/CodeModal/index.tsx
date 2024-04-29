import useAvatarOption from '@/hooks/useAvatarOption';
import './index.scss'
import { useEffect, useMemo, useState } from 'react';
import { highlightJSON } from '@/utils';
import ModalWrapper from '../ModalWrapper';
import { useTranslation } from 'react-i18next';
import IconClose from '@/assets/icons/icon-close.svg'
import PerfectScrollbar from '../PerfectScrollbar';
import classnames from 'classnames';

let clipboard: ClipboardJS

export default function CodeModal(props: { visible?: boolean; close?: () => void }) {
  const { t } = useTranslation()
  const [avatarOption] = useAvatarOption()
  const codeJSON = useMemo(() => JSON.stringify(avatarOption, null, 4), [avatarOption])
  const [highlightedCode, setHighlightedCode] = useState('')
  useEffect(() => {
    if(codeJSON) {
      setHighlightedCode(highlightJSON(codeJSON))
    }
  }, [codeJSON])
  const [copied, setCopied] = useState(false)
  const initClipboard = async () => {
    const { default: ClipboardJS } = await import('clipboard')
    clipboard = new ClipboardJS('#copy-code-btn')

    clipboard.on('success', (e) => {
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 800)

      e.clearSelection()
    })
  }

  useEffect(() => {
    initClipboard()

    return () => {
      clipboard.destroy()
    }
  }, [])



  return (
    <ModalWrapper visible={props.visible} close={props.close}>
      <div className="code-box">
        <div className="code-header">
          <div className="title">{t('text.codeModalTitle')}</div>

          <div className="close-btn" onClick={props.close}>
            <img src={IconClose} className="icon-close" alt={t('action.close')} />
          </div>
        </div>

        <div className="code-content-box">
          <PerfectScrollbar className="code-scroll-wrapper" options={{ suppressScrollX: false }}>
            <pre><code className="code-content" dangerouslySetInnerHTML={{ __html: highlightedCode }}></code></pre>
          </PerfectScrollbar>

          <button
            id="copy-code-btn"
            className={classnames('copy-btn', { copied })}
            data-clipboard-text={codeJSON}
          >
            { copied ? t('action.copied') : t('action.copyCode') }
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}