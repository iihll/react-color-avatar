import { useTranslation } from 'react-i18next';
import './index.scss'

export function DownloadModal(props: { visible?: boolean; imageUrl: string; close?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      {props.visible ? <div
        className="download-modal-wrapper"
        onClick={() => { props.close() }}
      >
        <div className="download-modal" onClick={(event) => { event.stopPropagation() }}>
          <div className="modal-body">
            <div className="avatar-preview">
              <img
                alt="vue-color-avatar"
                src={props.imageUrl}
                className="avatar-img"
              />
            </div>

            <p className="tip">{ t('text.downloadTip') } 🥳</p>
          </div>

          <button type="button" className="close-btn" onClick={() => { props.close() }}>
            { t('action.close') }
          </button>
        </div>
      </div> : null}
    </>
  )
}