import React, { useState } from 'react'
import { Row, Col, Select, List, Icon, Card } from 'antd'
import throttle from 'lodash/throttle'
import styles from './styles.module.less'

const Option = Select.Option
const categorys = [
  { label: '热门', value: 'trending' },
  { label: '新生', value: 'upcome' }
]
const periods = [
  { label: '今日', value: 'day' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' }
]
const langs = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Css', value: 'css' },
  { label: 'Html', value: 'html' },
  { label: 'TypeScript', value: 'typescript' }
]

const HotRepos = ({ data = [], getHotRepos, loading = [] }) => {
  const [postData, setPostData] = useState({
    category: categorys[0].value,
    period: periods[0].value,
    lang: langs[0].value,
    offset: 0,
    limit: 30
  })
  const listRef = React.createRef()

  const handleScroll = e => {
    let canScrollHeight = e.target.scrollHeight - e.target.offsetHeight
    // 距离底部100px是加载数据
    if (e.target.scrollTop >= canScrollHeight - 100) {
      const newPostData = {
        ...postData,
        offset: postData.offset + 1
      }
      setPostData(newPostData)
      getHotRepos(newPostData)
    }
  }

  const handleChangeFilter = newPostData => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
    setPostData(newPostData)
    getHotRepos(newPostData)
  }

  return (
    <Row
      type="flex"
      className={styles.root}
      style={{ flexDirection: 'column' }}
    >
      <Col className={styles.header}>
        <div className={styles.headerLeft}>
          <img
            className={styles.img}
            src="https://e-gold-cdn.xitu.io/static/github.png?9140c37"
          />
          <div className={styles.headerTitle}>GitHub</div>
          <Select
            size="small"
            style={{ width: 100 }}
            value={postData.category}
            onChange={category => {
              const newPostData = {
                ...postData,
                offset: 0,
                category
              }
              handleChangeFilter(newPostData)
            }}
          >
            {categorys.map(item => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Select
            size="small"
            style={{ width: 100, marginLeft: 8 }}
            value={postData.period}
            onChange={period => {
              const newPostData = {
                ...postData,
                offset: 0,
                period
              }
              handleChangeFilter(newPostData)
            }}
          >
            {periods.map(item => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.headerRight}>
          <Select
            size="small"
            style={{ width: 100 }}
            value={postData.lang}
            onChange={lang => {
              const newPostData = {
                ...postData,
                offset: 0,
                lang
              }
              handleChangeFilter(newPostData)
            }}
          >
            {langs.map(item => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
      </Col>
      <Col className={styles.listCol}>
        <div
          className={styles.list}
          ref={listRef}
          onScroll={throttle(handleScroll)}
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            loading={loading.includes('getHotRepos')}
            renderItem={item => (
              <Card className={styles.listItem} key={item.id}>
                <div className={styles.title}>
                  <a>
                    <span>{item.username}</span> <span>/</span>{' '}
                    <span>{item.reponame}</span>
                  </a>
                </div>
                <div className={styles.cont}>{item.description}</div>
                <div className={styles.footer}>
                  <span className={styles.star}>
                    <Icon type="star" style={{ marginRight: 5 }} />
                    {item.starCount}
                  </span>
                  <span className={styles.fork}>
                    <Icon type="fork" style={{ marginRight: 5 }} />
                    {item.forkCount}
                  </span>
                  {item.lang ? (
                    <span
                      className={styles.lang}
                      style={{ color: item.langColor }}
                    >
                      <i
                        className={styles.langIcon}
                        style={{ backgroundColor: item.langColor }}
                      />
                      {item.lang}
                    </span>
                  ) : null}
                </div>
              </Card>
            )}
          />
        </div>
      </Col>
    </Row>
  )
}

export default HotRepos
