import React from 'react'
import { Input } from 'antd'
import styles from './styles.module.less'

const HeaderBar = () => {
  return (
    <div className={styles.root}>
      <div className={styles.logo} />
      <div className={styles.searchInput}>
        <Input
          className={styles.input}
          placeholder="掘金搜索，如：Java，阿里巴巴，前端面试"
        />
      </div>
    </div>
  )
}

export default HeaderBar
