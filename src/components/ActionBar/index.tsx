import './index.scss'
import IconBack from '@/assets/icons/icon-back.svg'
import IconCode from '@/assets/icons/icon-code.svg'
import IconFlip from '@/assets/icons/icon-flip.svg'
import IconNext from '@/assets/icons/icon-next.svg'
import { ActionType } from '@/enums'
import { useAppSelector } from '@/store'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'

export default function ActionBar(props: {
  action: (actionType: ActionType) => void
}) {
  const { t } = useTranslation()
  const canUndo = useAppSelector(state => state.global.history.past.length > 0)
  const canRedo = useAppSelector(state => state.global.history.future.length > 0)
  const actions = useMemo(() => {
    return [
      {
        type: ActionType.Undo,
        icon: IconBack,
        tip: t('action.undo'),
        disabled: !canUndo,
      },
      {
        type: ActionType.Redo,
        icon: IconNext,
        tip: t('action.redo'),
        disabled: !canRedo,
      },
      {
        type: ActionType.Flip,
        icon: IconFlip,
        tip: t('action.flip'),
      },
      {
        type: ActionType.Code,
        icon: IconCode,
        tip: t('action.code'),
      },
    ]
  }, [canRedo, canUndo, t])

  return (
    <div className="action-menu">
      {actions.map(item => {
        return (
          <div key={item.type} className={classnames('menu-item', { disabled: item.disabled })} onClick={() => { props.action(item.type) }}>
            <img src={item.icon} alt={item.tip} />
          </div>
        )
      })}
    </div>
  )
}